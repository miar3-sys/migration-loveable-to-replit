import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowRight, Database, Server, Layout, Code, Cloud, Lock, Unlock, Zap, ShieldCheck, Cpu, GraduationCap } from 'lucide-react';

export default function MigrationPlanner() {
  const [mau, setMau] = useState<number[]>([10000]);
  const [dbSize, setDbSize] = useState<number[]>([1]);
  const [storage, setStorage] = useState<number[]>([5]);

  const handleMauChange = (val: number | number[]) => setMau(Array.isArray(val) ? val : [val]);
  const handleDbSizeChange = (val: number | number[]) => setDbSize(Array.isArray(val) ? val : [val]);
  const handleStorageChange = (val: number | number[]) => setStorage(Array.isArray(val) ? val : [val]);

  const calculateCosts = (currentMau: number, currentDb: number, currentStorage: number) => {
    // Fallbacks just in case
    const safeMau = currentMau || 1000;
    const safeDb = currentDb || 0.5;
    const safeStorage = currentStorage || 1;

    // Lovable + Supabase (Vercel hosting assumed)
    let supabaseCost = 0;
    let vercelCost = 0;
    
    if (safeMau > 50000 || safeDb > 0.5 || safeStorage > 1) {
      supabaseCost = 25; // Pro tier
      if (safeMau > 100000) supabaseCost += (safeMau - 100000) * 0.00325;
      if (safeDb > 8) supabaseCost += (safeDb - 8) * 0.125;
      if (safeStorage > 100) supabaseCost += (safeStorage - 100) * 0.021;
    }
    
    if (safeMau > 10000) {
      vercelCost = 20; // Vercel Pro
    }
    
    const lovableStack = supabaseCost + vercelCost;
    
    // Replit
    let replitCore = 15; // Replit Core subscription
    let replitDeploy = 6; // Basic reserved VM
    if (safeMau > 10000) replitDeploy = 20;
    if (safeMau > 50000) replitDeploy = 80;
    if (safeMau > 100000) replitDeploy = 160;
    if (safeMau > 500000) replitDeploy = 320;
    
    let replitDb = 0;
    if (safeDb > 0.5) replitDb = (safeDb - 0.5) * 0.15; // Approx Neon cost
    
    let replitStorage = 0;
    if (safeStorage > 1) replitStorage = (safeStorage - 1) * 0.02;
    
    const replitStack = replitCore + replitDeploy + replitDb + replitStorage;
    
    return { lovable: Math.round(lovableStack), replit: Math.round(replitStack) };
  };

  const generateChartData = () => {
    const data = [];
    const steps = [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000];
    
    for (const stepMau of steps) {
      // Scale DB and Storage roughly with MAU for the chart
      const scaleFactor = stepMau / (mau[0] || 1000);
      const stepDb = Math.max(0.1, (dbSize[0] || 1) * scaleFactor);
      const stepStorage = Math.max(0.5, (storage[0] || 5) * scaleFactor);
      
      const costs = calculateCosts(stepMau, stepDb, stepStorage);
      data.push({
        users: stepMau,
        name: stepMau >= 1000000 ? `${stepMau/1000000}M` : stepMau >= 1000 ? `${stepMau/1000}k` : stepMau,
        'Lovable + Supabase': costs.lovable,
        'Replit': costs.replit,
      });
    }
    return data;
  };

  const currentCosts = calculateCosts(mau[0], dbSize[0], storage[0]);
  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* University Header */}
      <header className="bg-[#13294B] text-white py-4 px-6 md:px-8 border-b-4 border-[#E84A27] shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#E84A27] text-white font-serif font-bold text-3xl w-12 h-12 flex items-center justify-center rounded-sm shadow-inner">
              I
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wider uppercase">University of Illinois</h1>
              <p className="text-xs md:text-sm text-blue-200 uppercase tracking-widest flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                Migration Planning Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#13294B]">IlliniXchange Stack Analysis</h2>
              <p className="text-slate-500 mt-1">Compare Lovable + Supabase vs Replit for the student trading application.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white px-3 py-1 text-sm border-[#13294B]/20 text-[#13294B] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#13294B] mr-2 inline-block"></span>
                Lovable + Supabase
              </Badge>
              <Badge variant="outline" className="bg-white px-3 py-1 text-sm border-[#E84A27]/20 text-[#E84A27] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E84A27] mr-2 inline-block"></span>
                Replit
              </Badge>
            </div>
          </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="cost">Cost Calculator</TabsTrigger>
            <TabsTrigger value="lockin">Lock-in Analysis</TabsTrigger>
          </TabsList>

          {/* ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Lovable + Supabase Architecture */}
              <Card className="border-[#13294B]/20 shadow-sm">
                <CardHeader className="bg-[#13294B]/5 border-b border-[#13294B]/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#13294B]">
                    <Layout className="w-5 h-5" />
                    Lovable + Supabase
                  </CardTitle>
                  <CardDescription>Decoupled frontend and backend architecture</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Frontend */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative">
                      <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Frontend (Vercel/Netlify)</div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                          <Code className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">React + Vite + Tailwind</p>
                          <p className="text-sm text-slate-500">Generated by Lovable, fully owned code</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-slate-300 rotate-90 md:rotate-0" />
                    </div>

                    {/* Backend */}
                    <div className="bg-white border border-[#13294B]/20 rounded-lg p-4 shadow-sm relative">
                      <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-[#13294B] uppercase tracking-wider">Backend (Supabase)</div>
                      <div className="grid gap-3 mt-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#13294B]/10 text-[#13294B] rounded-md">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">PostgreSQL Database</p>
                            <p className="text-sm text-slate-500">Relational data, Row Level Security</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#13294B]/10 text-[#13294B] rounded-md">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Auth & Storage</p>
                            <p className="text-sm text-slate-500">Built-in user management & S3 buckets</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#13294B]/10 text-[#13294B] rounded-md">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Edge Functions</p>
                            <p className="text-sm text-slate-500">Deno-based serverless functions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replit Architecture */}
              <Card className="border-[#E84A27]/20 shadow-sm">
                <CardHeader className="bg-[#E84A27]/5 border-b border-[#E84A27]/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#E84A27]">
                    <Cpu className="w-5 h-5" />
                    Replit
                  </CardTitle>
                  <CardDescription>Integrated cloud workspace and deployment</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Unified Workspace */}
                    <div className="bg-white border border-[#E84A27]/20 rounded-lg p-4 shadow-sm relative h-full">
                      <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-[#E84A27] uppercase tracking-wider">Replit Deployment (VM / Autoscale)</div>
                      
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border border-slate-100">
                          <div className="p-2 bg-[#E84A27]/10 text-[#E84A27] rounded-md">
                            <Server className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Unified Server (Node/Python)</p>
                            <p className="text-sm text-slate-500">Serves both frontend assets and API</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col items-center text-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-100">
                            <Database className="w-5 h-5 text-slate-600" />
                            <div>
                              <p className="font-medium text-sm text-slate-900">Replit DB / Neon</p>
                              <p className="text-xs text-slate-500">Managed Postgres</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center text-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-100">
                            <Cloud className="w-5 h-5 text-slate-600" />
                            <div>
                              <p className="font-medium text-sm text-slate-900">Object Storage</p>
                              <p className="text-xs text-slate-500">Built-in buckets</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-md flex items-start gap-3">
                          <Code className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-slate-900">Integrated IDE</p>
                            <p className="text-xs text-slate-500">Code, build, and deploy from the browser</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card>
              <CardHeader>
                <CardTitle>Architecture Trade-offs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Feature</TableHead>
                      <TableHead>Lovable + Supabase</TableHead>
                      <TableHead>Replit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Development Flow</TableCell>
                      <TableCell>Local IDE or Lovable UI {'->'} Git {'->'} CI/CD</TableCell>
                      <TableCell>Browser IDE {'->'} Direct Deploy</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Backend Logic</TableCell>
                      <TableCell>Postgres Functions + Edge Functions (Deno)</TableCell>
                      <TableCell>Full Node.js/Python server (Express, FastAPI)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Scalability</TableCell>
                      <TableCell>Serverless scaling, connection pooling built-in</TableCell>
                      <TableCell>VM scaling (requires configuration for high traffic)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COST TAB */}
          <TabsContent value="cost" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Controls */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Usage Parameters</CardTitle>
                  <CardDescription>Adjust sliders to see cost impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold">Monthly Active Users</Label>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{(mau[0] || 1000).toLocaleString()}</span>
                    </div>
                    <Slider 
                      value={mau} 
                      onValueChange={handleMauChange} 
                      min={1000}
                      max={1000000} 
                      step={1000}
                      className="py-4"
                    />
                    <p className="text-xs text-slate-500">Affects compute, bandwidth, and auth limits.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold">Database Size (GB)</Label>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{dbSize[0] || 0.5} GB</span>
                    </div>
                    <Slider 
                      value={dbSize} 
                      onValueChange={handleDbSizeChange} 
                      min={0.5}
                      max={100} 
                      step={0.5}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold">Storage (GB)</Label>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{storage[0] || 1} GB</span>
                    </div>
                    <Slider 
                      value={storage} 
                      onValueChange={handleStorageChange} 
                      min={1}
                      max={500} 
                      step={1}
                      className="py-4"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results & Chart */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#13294B]/5 border-[#13294B]/20">
                    <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                      <p className="text-sm font-medium text-[#13294B] mb-2">Lovable + Supabase</p>
                      <div className="text-4xl font-bold text-[#13294B]">${currentCosts.lovable}</div>
                      <p className="text-xs text-[#13294B]/70 mt-2">per month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#E84A27]/5 border-[#E84A27]/20">
                    <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                      <p className="text-sm font-medium text-[#E84A27] mb-2">Replit</p>
                      <div className="text-4xl font-bold text-[#E84A27]">${currentCosts.replit}</div>
                      <p className="text-xs text-[#E84A27]/70 mt-2">per month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Scaling</CardTitle>
                    <CardDescription>Estimated monthly cost as your user base grows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorLovable" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#13294B" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#13294B" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReplit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E84A27" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#E84A27" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                          <YAxis tickFormatter={(value) => `$${value}`} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, '']}
                            labelFormatter={(label) => `${label} Users`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Area type="monotone" dataKey="Lovable + Supabase" stroke="#13294B" strokeWidth={2} fillOpacity={1} fill="url(#colorLovable)" />
                          <Area type="monotone" dataKey="Replit" stroke="#E84A27" strokeWidth={2} fillOpacity={1} fill="url(#colorReplit)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* LOCK-IN TAB */}
          <TabsContent value="lockin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Lock-in Analysis</CardTitle>
                <CardDescription>How easy is it to move away from the platform?</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue={["code"]}>
                  
                  <AccordionItem value="code">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-md"><Code className="w-4 h-4 text-slate-700" /></div>
                        <span className="font-semibold">Code & Frontend</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#13294B] flex items-center gap-2">
                            <Unlock className="w-4 h-4" /> Lovable
                          </h4>
                          <p className="text-sm text-slate-600">
                            Lovable generates standard React/Vite/Tailwind code. You can push it to GitHub and deploy it anywhere (Vercel, Netlify, AWS). <strong>Zero lock-in</strong> on the frontend code.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#E84A27] flex items-center gap-2">
                            <Unlock className="w-4 h-4" /> Replit
                          </h4>
                          <p className="text-sm text-slate-600">
                            Replit workspaces can be linked to GitHub. You can export your code at any time. However, if you rely heavily on Replit-specific environment variables or Nix configurations, you may need to recreate your Docker/deployment setup elsewhere.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="database">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-md"><Database className="w-4 h-4 text-slate-700" /></div>
                        <span className="font-semibold">Database & Data</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#13294B] flex items-center gap-2">
                            <Unlock className="w-4 h-4" /> Supabase
                          </h4>
                          <p className="text-sm text-slate-600">
                            Supabase is built on standard PostgreSQL. You can dump your database at any time using standard `pg_dump`. Supabase itself is open-source and can be self-hosted via Docker if you want to leave their managed cloud. <strong>Low lock-in.</strong>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#E84A27] flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Replit DB / Neon
                          </h4>
                          <p className="text-sm text-slate-600">
                            If using Replit's native Key-Value DB, migration requires writing a custom script to extract data. If using their Neon Postgres integration, you have standard Postgres access, but the billing and connection management is tied to Replit. <strong>Medium lock-in.</strong>
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="auth">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-md"><ShieldCheck className="w-4 h-4 text-slate-700" /></div>
                        <span className="font-semibold">Authentication</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#13294B] flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Supabase Auth
                          </h4>
                          <p className="text-sm text-slate-600">
                            Supabase Auth uses GoTrue. While open-source, migrating users (especially passwords) to another provider like Auth0 or Firebase requires careful export/import of password hashes. <strong>Medium lock-in.</strong>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#E84A27] flex items-center gap-2">
                            <Unlock className="w-4 h-4" /> Replit Auth
                          </h4>
                          <p className="text-sm text-slate-600">
                            Replit provides built-in Replit Auth (login with Replit). If you use this, you are heavily locked in. However, most production Replit apps implement their own auth (e.g., Passport.js, NextAuth), which means you own the auth logic and can move it easily.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#13294B]/5 border-[#13294B]/20">
                <CardHeader>
                  <CardTitle className="text-[#13294B] text-lg">When to choose Lovable + Supabase</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-800">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#13294B] shrink-0" />
                      You want a production-ready, scalable relational database from day one.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#13294B] shrink-0" />
                      You prefer a decoupled architecture (separate frontend and backend).
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#13294B] shrink-0" />
                      You want to utilize Row Level Security (RLS) to handle authorization at the database level.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#13294B] shrink-0" />
                      You prioritize having zero lock-in on your frontend codebase.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#E84A27]/5 border-[#E84A27]/20">
                <CardHeader>
                  <CardTitle className="text-[#E84A27] text-lg">When to choose Replit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-800">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E84A27] shrink-0" />
                      You want the absolute fastest time-to-market for a full-stack prototype.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E84A27] shrink-0" />
                      You need a custom backend server (e.g., Python for AI/ML, complex Node.js logic) that serverless functions can't handle.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E84A27] shrink-0" />
                      You want to code, build, and deploy entirely from your browser without local setup.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E84A27] shrink-0" />
                      You prefer having everything (code, DB, hosting) billed and managed in one single platform.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </main>

      {/* University Footer */}
      <footer className="bg-[#13294B] text-white py-6 mt-auto border-t-4 border-[#E84A27]">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-blue-200">
            <p>&copy; {new Date().getFullYear()} University of Illinois at Urbana-Champaign</p>
            <p className="mt-1">IlliniXchange Development Team</p>
          </div>
          <div className="flex gap-4 text-sm text-blue-200">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
