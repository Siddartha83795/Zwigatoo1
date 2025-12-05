'use client';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, KeyRound, User, Phone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOutlets } from '@/lib/firestore'; // Import getOutlets
import type { Outlet } from '@/lib/types'; // Import Outlet type

const clientSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }), // Firebase requires min 6 chars
});
type ClientFormValues = z.infer<typeof clientSchema>;

const staffSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }), // Firebase requires min 6 chars
});
type StaffFormValues = z.infer<typeof staffSchema>;

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>("");
    const [loadingOutlets, setLoadingOutlets] = useState(true);
    const [errorOutlets, setErrorOutlets] = useState<string | null>(null);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const fetchedOutlets = await getOutlets();
                setOutlets(fetchedOutlets);
                if (fetchedOutlets.length > 0) {
                    setSelectedOutlet(fetchedOutlets[0].id); // Set first outlet as default
                }
            } catch (err: any) {
                console.error("Error fetching outlets:", err);
                setErrorOutlets("Failed to load outlets. Please try again later.");
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load outlets. Please try again later.",
                });
            } finally {
                setLoadingOutlets(false);
            }
        };
        fetchOutlets();
    }, [toast]);

    const clientForm = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const staffForm = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onClientSubmit: SubmitHandler<ClientFormValues> = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({
                title: "Client Login Successful",
                description: "Welcome back!",
            });
            router.push('/outlets');
        } catch (error: any) {
            console.error("Firebase Auth error:", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        }
    };

    const onStaffSubmit: SubmitHandler<StaffFormValues> = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            // Firebase Auth successfully signs in, no need for localStorage for session
            toast({
                title: "Staff Login Successful",
                description: "Redirecting to dashboard...",
            });
            router.push(`/staff/dashboard/${selectedOutlet}`);
        } catch (error: any) {
            console.error("Firebase Auth error:", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        }
    };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Tabs defaultValue="client" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        {/* Client Login Tab */}
        <TabsContent value="client">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Client Login</CardTitle>
              <CardDescription>Enter your credentials to sign in.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...clientForm}>
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                  <FormField
                    control={clientForm.control}
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
                    control={clientForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                           <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="pl-10"/>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={!clientForm.formState.isValid}>
                    Login as Client
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Login Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Staff Login</CardTitle>
              <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...staffForm}>
                <form onSubmit={staffForm.handleSubmit(onStaffSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outlet">Select Outlet</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Select value={selectedOutlet} onValueChange={setSelectedOutlet} disabled={loadingOutlets || !!errorOutlets}>
                            <SelectTrigger className="pl-10">
                                {loadingOutlets ? (
                                    <SelectValue placeholder="Loading outlets..." />
                                ) : errorOutlets ? (
                                    <SelectValue placeholder={errorOutlets} />
                                ) : (
                                    <SelectValue placeholder="Select an outlet" />
                                )}
                            </SelectTrigger>
                            <SelectContent>
                                {outlets.map(outlet => (
                                    <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <FormField
                    control={staffForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <FormControl>
                            <Input placeholder="staff@example.com" {...field} className="pl-10"/>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={staffForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                           <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <FormControl>
                            <Input type="password" {...field} className="pl-10"/>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <p className="text-xs text-center text-muted-foreground pt-4">
                        Login will redirect to the selected outlet dashboard.
                    </p>
                  <Button type="submit" className="w-full">
                    Login as Staff
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
