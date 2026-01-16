
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, ArrowLeft } from 'lucide-react';

type UserRole = 'Candidate' | 'Employer';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Candidate');
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSignup = () => {
    const success = signup(username, password, role);
    if (success) {
      toast({ title: 'Signup Successful!', description: 'Your account has been created.' });
      router.push('/jobs');
    } else {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'A user with this username already exists.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card className="w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Ethlance</h1>
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join the decentralized job marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup defaultValue="Candidate" value={role} onValueChange={(value: UserRole) => setRole(value)} className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Candidate" id="r1" />
                <Label htmlFor="r1">Candidate (Job Seeker)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Employer" id="r2" />
                <Label htmlFor="r2">Employer (Hiring)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignup}>
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
        </Card>
      </div>
    </div>
  );
}
