export type Job = {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
    logoBg: string;
    logoIpfsCid: string;
  };
  description: string;
  budget: number;
  currency: 'ETH';
  deadline: string;
  tags: string[];
  postedAt: string; // Should be ISO 8601 string
  location: string;
  status: 'Open' | 'InProgress' | 'Completed' | 'Closed' | 'Expired';
  userId: string; // Address of the user who posted the job
  applicants?: number;
};

export type Application = {
  jobId: string;
  applicant: string;
  status: 'Submitted' | 'Reviewed' | 'Accepted' | 'Rejected';
  resumeIpfsCid: string;
};
