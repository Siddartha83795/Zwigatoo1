'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockUserProfile } from '@/lib/data';
import { User, Mail, Phone, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import BackButton from '@/components/back-button';


const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().regex(/^\+91\d{10}$/, { message: "Phone number must be in the format +91XXXXXXXXXX." }),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);

  // Load user profile from localStorage on initial render
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to parse user profile from localStorage", error);
    }
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Use values to ensure the form re-renders when userProfile changes
    values: userProfile,
    mode: 'onTouched'
  });

  function onSubmit(data: ProfileFormValues) {
    console.log('Profile updated:', data);
    const updatedProfile = {...userProfile, ...data, isProfileComplete: true};
    
    // Update state
    setUserProfile(updatedProfile);
    
    // Persist to localStorage
    try {
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('isProfileComplete', 'true');
    } catch (error) {
        console.error("Failed to save user profile to localStorage", error);
    }

    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
    // Redirect to outlets page after profile completion
    router.push('/outlets');
  }

  return (
    <div className="container py-12">
        <div className="mb-8">
            <BackButton />
        </div>
       <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
                Complete Your Profile
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                This information is required before you can place an order.
            </p>
        </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Your Details</CardTitle>
          <CardDescription>Please fill out your details. This information will be shared with the staff when you place an order.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                     <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="tel" placeholder="+919876543210" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                     <div className="relative">
                      <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Textarea placeholder="123, Foodie Lane..." {...field} className="pl-10 min-h-[100px]" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Save and Continue</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
