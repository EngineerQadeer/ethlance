'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Job, Application } from '@/lib/types';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import JobContract from '@/lib/JobContract.json';
import { useToast } from '@/hooks/use-toast';
import { useJobs } from './JobsContext';

interface ApplicationsContextType {
  applications: Application[];
  appliedJobIds: Set<string>;
  applyForJob: (jobId: string) => void;
  loading: boolean;
  refetch: () => void;
  isApplying: boolean;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const mapContractApplicationToApplicationType = (contractApplication: any): Application => {
  const statusMapping = ['Submitted', 'Reviewed', 'Accepted', 'Rejected'];
  return {
    jobId: contractApplication.jobId.toString(),
    applicant: contractApplication.applicant,
    status: statusMapping[contractApplication.status] as Application['status'],
    resumeIpfsCid: contractApplication.resumeIpfsCid
  };
};

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { toast } = useToast();
  const { jobs } = useJobs(); // We need jobs to link applications back to job details

  const { data, isLoading, refetch } = useReadContract({
    abi: JobContract.abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getApplicationsForApplicant',
    args: [address],
    query: {
      enabled: !!address,
      // Cache data for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Don't refetch when the window is focused
      refetchOnWindowFocus: false,
    },
  });

  const { writeContract, isPending: isApplying } = useWriteContract();

  const applications: Application[] = Array.isArray(data)
    ? data.map(mapContractApplicationToApplicationType)
    : [];
  
  const appliedJobIds = new Set(applications.map(app => app.jobId));

  const applyForJob = (jobId: string) => {
    // In a real implementation, we'd get the resume CID from an IPFS upload.
    const mockResumeCid = "QmXo2D8dsgt19A1d5W4f29kAmH2t2s5a5d8e3f4g6h7i8j";

    writeContract({
      abi: JobContract.abi,
      address: CONTRACT_ADDRESS,
      functionName: 'applyForJob',
      args: [BigInt(jobId), mockResumeCid],
    }, {
      onSuccess: () => {
        toast({
          title: 'Transaction Submitted!',
          description: 'Your application is being processed.',
        });
        refetch();
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          title: 'Application Failed',
          description: err.message,
        });
      },
    });
  };

  const getAppliedJobs = (): Job[] => {
    if (!jobs.length || !applications.length) {
      return [];
    }
    return applications.map(app => jobs.find(job => job.id === app.jobId)).filter(job => job !== undefined) as Job[];
  }

  return (
    <ApplicationsContext.Provider value={{ applications, appliedJobIds, applyForJob, loading: isLoading, refetch, isApplying }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
}
