'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Database, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, 
                post a job, or apply for a position. This may include your name, email address, 
                wallet address, and professional information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Blockchain Data</h3>
              <p className="text-muted-foreground">
                Since we operate on the blockchain, your wallet address and transaction history 
                are publicly visible on the blockchain. This is inherent to blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <p className="text-muted-foreground">
                We collect information about how you use our platform, including pages visited, 
                features used, and interactions with our services.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground">
              <li>• To provide and maintain our services</li>
              <li>• To process transactions and manage smart contracts</li>
              <li>• To communicate with you about your account and our services</li>
              <li>• To improve our platform and develop new features</li>
              <li>• To ensure platform security and prevent fraud</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, please note that no method of transmission over the internet or electronic storage is 100% secure.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Your wallet and private keys are never stored on our servers. You are responsible for 
                keeping your wallet secure and private keys confidential.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• When required by law or legal process</li>
              <li>• To protect our rights, property, or safety</li>
              <li>• With your explicit consent</li>
              <li>• In connection with a business transfer or acquisition</li>
            </ul>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Information stored on the blockchain is publicly visible and immutable. 
                This includes job postings, applications, and transaction data.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You have certain rights regarding your personal information:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Access to your personal information</li>
              <li>• Correction of inaccurate information</li>
              <li>• Deletion of your personal information (subject to blockchain limitations)</li>
              <li>• Objection to processing of your information</li>
              <li>• Data portability</li>
            </ul>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Blockchain Limitation:</strong> Data stored on the blockchain cannot be deleted 
                or modified due to the immutable nature of blockchain technology.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience on our platform. 
              You can control cookie settings through your browser preferences.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Types of Cookies</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Essential cookies for platform functionality</li>
                <li>• Analytics cookies to understand usage patterns</li>
                <li>• Preference cookies to remember your settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date. 
              Your continued use of our services after any changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> privacy@ethlance.com
              </p>
              <p className="text-sm">
                <strong>Address:</strong> 123 Blockchain Street, Web3 City, WC 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
