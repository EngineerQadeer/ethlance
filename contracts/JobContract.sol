// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// Counters removed in OZ v5; use a simple uint counter instead

contract JobContract is AccessControl, ReentrancyGuard {
    uint256 private _jobIds;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");
    bytes32 public constant JOB_MANAGER_ROLE = keccak256("JOB_MANAGER_ROLE");

    enum JobStatus { Open, InProgress, Completed, Closed, Expired }
    enum JobType { FullTime, PartTime, Internship, Freelance, Contract }
    enum WorkMode { Remote, OnSite, Hybrid }
    enum ApplicationStatus { Submitted, Reviewed, Accepted, Rejected }

    struct Job {
        uint id;
        address employer;
        string organizationName;
        string jobTitle;
        string jobDescription;
        uint budget;
        JobStatus status;
        JobType jobType;
        WorkMode workMode;
        uint deadline;
        string[] categories;
        uint postedAt;
        string logoIpfsCid;
    }

     struct Application {
        uint jobId;
        address applicant;
        ApplicationStatus status;
        string resumeIpfsCid;
    }

    mapping(uint => Job) public jobs;
    mapping(uint => Application[]) internal applicationsByJobId;
    mapping(address => Application[]) internal applicationsByApplicant;

    uint256 public serviceFeePercent = 1; // 1% default service fee

    event JobCreated(uint indexed id, address indexed employer, string jobTitle, uint budget);
    event JobStatusChanged(uint indexed id, JobStatus newStatus);
    event ApplicationSubmitted(uint indexed jobId, address indexed applicant);
    event ApplicationStatusChanged(uint indexed jobId, address indexed applicant, ApplicationStatus newStatus);
    event ServiceFeeChanged(uint256 newFeePercent);


    constructor() {
        address hardcodedAdmin = 0xa5e03A33A0E795154EBbEF97d6C968328C572DB1;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(EMPLOYER_ROLE, msg.sender);
        _grantRole(JOB_MANAGER_ROLE, msg.sender);

        // Grant all roles to the hardcoded admin address for easy development access
        _grantRole(DEFAULT_ADMIN_ROLE, hardcodedAdmin);
        _grantRole(ADMIN_ROLE, hardcodedAdmin);
        _grantRole(EMPLOYER_ROLE, hardcodedAdmin);
        _grantRole(JOB_MANAGER_ROLE, hardcodedAdmin);
    }

    function createJob(
        string memory organizationName,
        string memory jobTitle,
        string memory jobDescription,
        uint256 budget,
        JobType jobType,
        WorkMode workMode,
        uint256 deadline,
        string[] memory categories,
        string memory logoIpfsCid
    ) public returns (uint) {
        _jobIds += 1;
        uint256 newJobId = _jobIds;

        jobs[newJobId] = Job({
            id: newJobId,
            employer: msg.sender,
            organizationName: organizationName,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            budget: budget,
            status: JobStatus.Open,
            jobType: jobType,
            workMode: workMode,
            deadline: deadline,
            categories: categories,
            postedAt: block.timestamp,
            logoIpfsCid: logoIpfsCid
        });

        // Grant employer role to the job poster if they don't have it
        if (!hasRole(EMPLOYER_ROLE, msg.sender)) {
            _grantRole(EMPLOYER_ROLE, msg.sender);
        }

        emit JobCreated(newJobId, msg.sender, jobTitle, budget);
        return newJobId;
    }

    function applyForJob(uint256 jobId, string memory resumeIpfsCid) public {
        require(jobs[jobId].id != 0, "Job does not exist");
        require(jobs[jobId].status == JobStatus.Open, "Job is not open for applications");
        require(jobs[jobId].employer != msg.sender, "Employer cannot apply to their own job");

        Application memory newApplication = Application({
            jobId: jobId,
            applicant: msg.sender,
            status: ApplicationStatus.Submitted,
            resumeIpfsCid: resumeIpfsCid
        });

        applicationsByJobId[jobId].push(newApplication);
        applicationsByApplicant[msg.sender].push(newApplication);

        emit ApplicationSubmitted(jobId, msg.sender);
    }
    
    function changeJobStatus(uint256 jobId, JobStatus newStatus) public {
        require(jobs[jobId].id != 0, "Job does not exist");
        require(jobs[jobId].employer == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");

        jobs[jobId].status = newStatus;
        emit JobStatusChanged(jobId, newStatus);
    }

    function updateApplicationStatus(uint256 jobId, address applicant, ApplicationStatus newStatus) public {
        require(jobs[jobId].id != 0, "Job does not exist");
        require(jobs[jobId].employer == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized to update status for this job");

        bool found = false;
        for (uint i = 0; i < applicationsByJobId[jobId].length; i++) {
            if (applicationsByJobId[jobId][i].applicant == applicant) {
                applicationsByJobId[jobId][i].status = newStatus;
                found = true;
                break;
            }
        }
        require(found, "Application not found for this job");

        // Also update in the applicant's own list
        for (uint i = 0; i < applicationsByApplicant[applicant].length; i++) {
            if (applicationsByApplicant[applicant][i].jobId == jobId) {
                applicationsByApplicant[applicant][i].status = newStatus;
                break;
            }
        }

        emit ApplicationStatusChanged(jobId, applicant, newStatus);
    }

    // --- Admin Functions ---

    function setServiceFee(uint256 _newFeePercent) public onlyRole(ADMIN_ROLE) {
        require(_newFeePercent <= 100, "Service fee cannot exceed 100%");
        serviceFeePercent = _newFeePercent;
        emit ServiceFeeChanged(_newFeePercent);
    }

    function withdrawFunds() public onlyRole(ADMIN_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to withdraw funds");
    }
    
    function changeJobStatusAsAdmin(uint256 jobId, JobStatus newStatus) public onlyRole(ADMIN_ROLE) {
         require(jobs[jobId].id != 0, "Job does not exist");
        jobs[jobId].status = newStatus;
        emit JobStatusChanged(jobId, newStatus);
    }

    function updateApplicationStatusAsAdmin(uint256 jobId, address applicant, ApplicationStatus newStatus) public onlyRole(ADMIN_ROLE) {
        require(jobs[jobId].id != 0, "Job does not exist");

        bool found = false;
        for (uint i = 0; i < applicationsByJobId[jobId].length; i++) {
            if (applicationsByJobId[jobId][i].applicant == applicant) {
                applicationsByJobId[jobId][i].status = newStatus;
                found = true;
                break;
            }
        }
        require(found, "Application not found for this job");
        
        for (uint i = 0; i < applicationsByApplicant[applicant].length; i++) {
            if (applicationsByApplicant[applicant][i].jobId == jobId) {
                applicationsByApplicant[applicant][i].status = newStatus;
                break;
            }
        }

        emit ApplicationStatusChanged(jobId, applicant, newStatus);
    }

    // --- View Functions ---

    function getAllJobs() public view returns (Job[] memory) {
        uint totalJobs = _jobIds;
        Job[] memory allJobs = new Job[](totalJobs);
        for (uint i = 1; i <= totalJobs; i++) {
            allJobs[i-1] = jobs[i];
        }
        return allJobs;
    }

    function getApplicationsForJob(uint256 jobId) public view returns (Application[] memory) {
        require(jobs[jobId].employer == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized to view applications for this job");
        return applicationsByJobId[jobId];
    }
    
    function getApplicationsForApplicant(address applicant) public view returns (Application[] memory) {
        require(applicant == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized to view these applications");
        return applicationsByApplicant[applicant];
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
