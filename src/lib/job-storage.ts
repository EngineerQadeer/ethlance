import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import type { Job } from './types';

// Fallback storage using localStorage for development
const FALLBACK_STORAGE_KEY = 'ethlance_jobs';

const JOBS_COLLECTION = 'jobs';

export interface StoredJob extends Job {
  contractJobId?: string; // The ID from the smart contract
  isFromContract: boolean; // Whether this job was created via contract
  createdAt: string;
  updatedAt: string;
}

export class JobStorage {
  // Store a job in Firebase or localStorage fallback
  static async storeJob(job: Job, contractJobId?: string): Promise<string> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage');
      return this.storeJobLocal(job, contractJobId);
    }

    try {
      const storedJob: StoredJob = {
        ...job,
        contractJobId,
        isFromContract: !!contractJobId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, JOBS_COLLECTION), storedJob);
      return docRef.id;
    } catch (error) {
      console.warn('Firebase operation failed, using localStorage fallback:', error);
      // Fallback to localStorage
      return this.storeJobLocal(job, contractJobId);
    }
  }

  // Fallback storage using localStorage
  private static storeJobLocal(job: Job, contractJobId?: string): string {
    try {
      const storedJob: StoredJob = {
        ...job,
        contractJobId,
        isFromContract: !!contractJobId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingJobs = this.getLocalJobs();
      const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      storedJob.id = newId;
      
      existingJobs.push(storedJob);
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(existingJobs));
      
      return newId;
    } catch (error) {
      console.error('Error storing job locally:', error);
      throw error;
    }
  }

  // Get jobs from localStorage
  private static getLocalJobs(): StoredJob[] {
    try {
      const stored = localStorage.getItem(FALLBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local jobs:', error);
      return [];
    }
  }

  // Get all jobs from Firebase or localStorage fallback
  static async getAllJobs(): Promise<StoredJob[]> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage');
      return this.getLocalJobs();
    }

    try {
      const q = query(collection(db, JOBS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as StoredJob));
    } catch (error) {
      console.warn('Firebase operation failed, using localStorage fallback:', error);
      // Fallback to localStorage
      return this.getLocalJobs();
    }
  }

  // Get jobs by status
  static async getJobsByStatus(status: Job['status']): Promise<StoredJob[]> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage');
      return this.getLocalJobs().filter(job => job.status === status);
    }

    try {
      const q = query(
        collection(db, JOBS_COLLECTION), 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as StoredJob));
    } catch (error) {
      console.warn('Firebase operation failed, using localStorage fallback:', error);
      // Fallback to localStorage
      return this.getLocalJobs().filter(job => job.status === status);
    }
  }

  // Update job status
  static async updateJobStatus(jobId: string, status: Job['status']): Promise<void> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage');
      this.updateJobStatusLocal(jobId, status);
      return;
    }

    try {
      const jobRef = doc(db, JOBS_COLLECTION, jobId);
      await updateDoc(jobRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Firebase operation failed, using localStorage fallback:', error);
      // Fallback to localStorage
      this.updateJobStatusLocal(jobId, status);
    }
  }

  // Update job status in localStorage
  private static updateJobStatusLocal(jobId: string, status: Job['status']): void {
    try {
      const jobs = this.getLocalJobs();
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        jobs[jobIndex].status = status;
        jobs[jobIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(jobs));
      }
    } catch (error) {
      console.error('Error updating job status locally:', error);
    }
  }

  // Delete a job
  static async deleteJob(jobId: string): Promise<void> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage');
      this.deleteJobLocal(jobId);
      return;
    }

    try {
      const jobRef = doc(db, JOBS_COLLECTION, jobId);
      await deleteDoc(jobRef);
    } catch (error) {
      console.warn('Firebase operation failed, using localStorage fallback:', error);
      // Fallback to localStorage
      this.deleteJobLocal(jobId);
    }
  }

  // Delete job from localStorage
  private static deleteJobLocal(jobId: string): void {
    try {
      const jobs = this.getLocalJobs();
      const filteredJobs = jobs.filter(job => job.id !== jobId);
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(filteredJobs));
    } catch (error) {
      console.error('Error deleting job locally:', error);
    }
  }

  // Sync contract jobs with Firebase or localStorage
  static async syncContractJobs(contractJobs: Job[]): Promise<void> {
    // Check if Firebase is available
    if (!db) {
      console.log('Firebase not available, using localStorage sync');
      this.syncContractJobsLocal(contractJobs);
      return;
    }

    try {
      const existingJobs = await this.getAllJobs();
      const contractJobIds = new Set(contractJobs.map(job => job.id));

      // Remove jobs that no longer exist in the contract
      for (const existingJob of existingJobs) {
        if (existingJob.isFromContract && existingJob.contractJobId && !contractJobIds.has(existingJob.contractJobId)) {
          await this.deleteJob(existingJob.id);
        }
      }

      // Add new contract jobs
      for (const contractJob of contractJobs) {
        const existingJob = existingJobs.find(job => 
          job.isFromContract && job.contractJobId === contractJob.id
        );

        if (!existingJob) {
          await this.storeJob(contractJob, contractJob.id);
        }
      }
    } catch (error) {
      console.warn('Firebase sync failed, using localStorage fallback:', error);
      // Fallback sync with localStorage
      this.syncContractJobsLocal(contractJobs);
    }
  }

  // Sync contract jobs with localStorage
  private static syncContractJobsLocal(contractJobs: Job[]): void {
    try {
      const existingJobs = this.getLocalJobs();
      const contractJobIds = new Set(contractJobs.map(job => job.id));

      // Remove jobs that no longer exist in the contract
      const filteredJobs = existingJobs.filter(job => 
        !(job.isFromContract && job.contractJobId && !contractJobIds.has(job.contractJobId))
      );

      // Add new contract jobs
      for (const contractJob of contractJobs) {
        const existingJob = filteredJobs.find(job => 
          job.isFromContract && job.contractJobId === contractJob.id
        );

        if (!existingJob) {
          const storedJob: StoredJob = {
            ...contractJob,
            contractJobId: contractJob.id,
            isFromContract: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          storedJob.id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          filteredJobs.push(storedJob);
        }
      }

      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(filteredJobs));
    } catch (error) {
      console.error('Error syncing contract jobs locally:', error);
    }
  }
}
