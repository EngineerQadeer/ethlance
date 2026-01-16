'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Job } from '@/lib/types';
import { useReadContract } from 'wagmi';
import JobContract from '@/lib/JobContract.json';
import { formatEther } from 'viem';
import { JobStorage, type StoredJob } from '@/lib/job-storage';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const mapContractJobToJobType = (contractJob: any): Job => {
  const jobTypeMapping = ['FullTime', 'PartTime', 'Internship', 'Freelance', 'Contract'];
  const workModeMapping = ['Remote', 'OnSite', 'Hybrid'];
  const jobStatusMapping = ['Open', 'InProgress', 'Completed', 'Closed', 'Expired'];
  
  return {
    id: contractJob.id.toString(),
    title: contractJob.jobTitle,
    company: {
      name: contractJob.organizationName,
      logoUrl: `https://picsum.photos/seed/${contractJob.id.toString()}/100/100`, // Placeholder
      logoBg: 'bg-indigo-500', // Placeholder
      logoIpfsCid: contractJob.logoIpfsCid,
    },
    description: contractJob.jobDescription,
    budget: parseFloat(formatEther(contractJob.budget)),
    currency: 'ETH',
    deadline: new Date(Number(contractJob.deadline) * 1000).toISOString(),
    tags: contractJob.categories,
    postedAt: new Date(Number(contractJob.postedAt) * 1000).toISOString(),
    location: workModeMapping[contractJob.workMode] || 'Remote',
    status: jobStatusMapping[Number(contractJob.status)] as Job['status'],
    userId: contractJob.employer,
    applicants: 0, // Placeholder, will be updated from application data
  };
};

export function JobsProvider({ children }: { children: ReactNode }) {
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const { data, error, isLoading, refetch } = useReadContract({
    abi: JobContract.abi,
    address: CONTRACT_ADDRESS,
    functionName: 'getAllJobs',
    query: {
        staleTime: 5_000, // 5 seconds
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        gcTime: 30_000, // keep cache small
    }
  });

  const contractJobs = Array.isArray(data) ? data.map(mapContractJobToJobType).reverse() : [];

  // Load jobs from Firebase on mount
  useEffect(() => {
    const loadLocalJobs = async () => {
      setIsLoadingLocal(true);
      try {
        const storedJobs = await JobStorage.getAllJobs();
        const jobs = storedJobs.map((storedJob: StoredJob) => ({
          id: storedJob.id,
          title: storedJob.title,
          company: storedJob.company,
          description: storedJob.description,
          budget: storedJob.budget,
          currency: storedJob.currency,
          deadline: storedJob.deadline,
          tags: storedJob.tags,
          postedAt: storedJob.postedAt,
          location: storedJob.location,
          status: storedJob.status,
          userId: storedJob.userId,
          applicants: storedJob.applicants,
        }));
        setLocalJobs(jobs);
      } catch (error) {
        console.error('Error loading local jobs:', error);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    loadLocalJobs();
  }, []);

  // Sync contract jobs with Firebase when contract data changes
  useEffect(() => {
    if (contractJobs.length > 0) {
      JobStorage.syncContractJobs(contractJobs);
    }
  }, [contractJobs]);

  // Combine contract jobs and local jobs, prioritizing contract jobs
  const allJobs = React.useMemo(() => {
    const contractJobIds = new Set(contractJobs.map(job => job.id));
    const nonContractLocalJobs = localJobs.filter(job => !contractJobIds.has(job.id));
    return [...contractJobs, ...nonContractLocalJobs];
  }, [contractJobs, localJobs]);

  const handleRefetch = useCallback(async () => {
    await refetch();
    // Also refresh local jobs
    try {
      const storedJobs = await JobStorage.getAllJobs();
      const jobs = storedJobs.map((storedJob: StoredJob) => ({
        id: storedJob.id,
        title: storedJob.title,
        company: storedJob.company,
        description: storedJob.description,
        budget: storedJob.budget,
        currency: storedJob.currency,
        deadline: storedJob.deadline,
        tags: storedJob.tags,
        postedAt: storedJob.postedAt,
        location: storedJob.location,
        status: storedJob.status,
        userId: storedJob.userId,
        applicants: storedJob.applicants,
      }));
      setLocalJobs(jobs);
    } catch (error) {
      console.error('Error refreshing local jobs:', error);
    }
  }, [refetch]);

  return (
    <JobsContext.Provider value={{ 
      jobs: allJobs, 
      loading: isLoading || isLoadingLocal, 
      error, 
      refetch: handleRefetch 
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
