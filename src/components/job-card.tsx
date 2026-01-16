import type { Job } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <Card className="flex h-full transform flex-col transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${job.company.logoBg}`}>
                <Image
                    src={job.company.logoUrl}
                    alt={`${job.company.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-md"
                    data-ai-hint="company logo"
                />
            </div>
            <div>
                <CardDescription>{job.company.name}</CardDescription>
                <CardTitle className="text-lg font-semibold leading-tight">
                    <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                        {job.title}
                    </Link>
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
            <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                {job.tags.length > 3 && <Badge variant="secondary">+{job.tags.length - 3}</Badge>}
            </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                </div>
            </div>
             <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-xl font-bold text-accent">{job.budget} <span className="text-sm font-medium text-muted-foreground">{job.currency}</span></p>
                <Link href={`/jobs/${job.id}`}>
                    <Button variant="ghost" size="sm">
                        View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        </CardFooter>
    </Card>
  );
}
