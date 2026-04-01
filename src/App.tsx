import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowRight, ArrowDown, Database, Server, Layout, Code, Cloud, Lock, Unlock, Zap, ShieldCheck, Cpu, GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-[#E84A27] selection:text-white">
      {/* University Header */}
      <header className="bg-slate-900 text-white py-4 px-6 md:px-8 border-b-2 border-[#E84A27] shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#E84A27] text-white font-serif font-bold text-3xl w-12 h-12 flex items-center justify-center rounded-sm shadow-inner">
              I
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-slate-100">University of Illinois</h1>
              <p className="text-xs md:text-sm text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                Migration Planning Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-800">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">IlliniXchange Stack Analysis</h2>
              <p className="text-slate-400 mt-1">Compare Lovable + Supabase vs Replit for the student trading application.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-slate-800 px-3 py-1 text-sm border-blue-500/30 text-blue-400 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 inline-block"></span>
                Lovable + Supabase
              </Badge>
              <Badge variant="outline" className="bg-slate-800 px-3 py-1 text-sm border-[#E84A27]/30 text-[#E84A27] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E84A27] mr-2 inline-block"></span>
                Replit
              </Badge>
            </div>
          </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900 border border-slate-800">
            <TabsTrigger value="architecture" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Architecture & Comparison</TabsTrigger>
            <TabsTrigger value="cost" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Cost Calculator</TabsTrigger>
          </TabsList>

          {/* ARCHITECTURE & COMPARISON TAB */}
          <TabsContent value="architecture" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Lovable + Supabase Architecture */}
              <Card className="bg-slate-900 border-blue-500/20 shadow-sm">
                <CardHeader className="bg-blue-950/30 border-b border-blue-500/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Layout className="w-5 h-5" />
                    Lovable + Supabase
                  </CardTitle>
                  <CardDescription className="text-slate-400">Decoupled frontend and backend</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-3">
                    {/* Frontend */}
                    <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                      <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Frontend</div>
                      <Code className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="font-medium text-slate-200">React + Vite + Tailwind</p>
                      <p className="text-xs text-slate-400 mt-1">Deployed on Vercel/Netlify</p>
                    </div>

                    <ArrowDown className="w-5 h-5 text-slate-600" />

                    {/* Edge */}
                    <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                      <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">API Layer</div>
                      <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="font-medium text-slate-200">Edge Functions (Deno)</p>
                      <p className="text-xs text-slate-400 mt-1">Serverless business logic</p>
                    </div>

                    <ArrowDown className="w-5 h-5 text-slate-600" />

                    {/* Database & Auth */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                        <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</div>
                        <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="font-medium text-slate-200">PostgreSQL</p>
                        <p className="text-xs text-slate-400 mt-1">Relational DB + RLS</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                        <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Auth</div>
                        <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="font-medium text-slate-200">GoTrue Auth</p>
                        <p className="text-xs text-slate-400 mt-1">Built-in user mgmt</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replit Architecture */}
              <Card className="bg-slate-900 border-[#E84A27]/20 shadow-sm">
                <CardHeader className="bg-[#E84A27]/10 border-b border-[#E84A27]/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-[#E84A27]">
                    <Cpu className="w-5 h-5" />
                    Replit
                  </CardTitle>
                  <CardDescription className="text-slate-400">Integrated cloud workspace</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-3 h-full">
                    {/* IDE */}
                    <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                      <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</div>
                      <Code className="w-6 h-6 text-[#E84A27] mx-auto mb-2" />
                      <p className="font-medium text-slate-200">Browser IDE</p>
                      <p className="text-xs text-slate-400 mt-1">Code, build, and deploy in one place</p>
                    </div>

                    <ArrowDown className="w-5 h-5 text-slate-600" />

                    {/* Server */}
                    <div className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                      <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Compute</div>
                      <Server className="w-6 h-6 text-[#E84A27] mx-auto mb-2" />
                      <p className="font-medium text-slate-200">Unified Server (VM)</p>
                      <p className="text-xs text-slate-400 mt-1">Node.js/Python serves frontend & API</p>
                    </div>

                    <ArrowDown className="w-5 h-5 text-slate-600" />

                    {/* Storage */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                        <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</div>
                        <Database className="w-6 h-6 text-[#E84A27] mx-auto mb-2" />
                        <p className="font-medium text-slate-200">Replit DB / Neon</p>
                        <p className="text-xs text-slate-400 mt-1">Managed storage</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center relative">
                        <div className="absolute -top-3 left-4 bg-slate-800 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Assets</div>
                        <Cloud className="w-6 h-6 text-[#E84A27] mx-auto mb-2" />
                        <p className="font-medium text-slate-200">Object Storage</p>
                        <p className="text-xs text-slate-400 mt-1">Built-in buckets</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Comprehensive Comparison</CardTitle>
                <CardDescription className="text-slate-400">Architecture, Lock-in, and Use Cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="w-1/4 text-slate-400">Feature / Aspect</TableHead>
                        <TableHead className="w-3/8 text-blue-400">Lovable + Supabase</TableHead>
                        <TableHead className="w-3/8 text-[#E84A27]">Replit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Development Flow</TableCell>
                        <TableCell className="text-slate-400">Local IDE or Lovable UI {'->'} Git {'->'} CI/CD</TableCell>
                        <TableCell className="text-slate-400">Browser IDE {'->'} Direct Deploy</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Backend Logic</TableCell>
                        <TableCell className="text-slate-400">Postgres Functions + Edge Functions (Deno)</TableCell>
                        <TableCell className="text-slate-400">Full Node.js/Python server (Express, FastAPI)</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Scalability</TableCell>
                        <TableCell className="text-slate-400">Serverless scaling, connection pooling built-in</TableCell>
                        <TableCell className="text-slate-400">VM scaling (requires configuration for high traffic)</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Frontend Lock-in</TableCell>
                        <TableCell className="text-slate-400"><span className="text-emerald-400 font-semibold">Zero:</span> Standard React/Vite code, deploy anywhere.</TableCell>
                        <TableCell className="text-slate-400"><span className="text-amber-400 font-semibold">Low:</span> Code is exportable, but deployment setup is Replit-specific.</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Database Lock-in</TableCell>
                        <TableCell className="text-slate-400"><span className="text-emerald-400 font-semibold">Low:</span> Standard PostgreSQL, easy to dump and self-host.</TableCell>
                        <TableCell className="text-slate-400"><span className="text-amber-400 font-semibold">Medium:</span> Replit DB requires custom extraction. Neon is standard but billed via Replit.</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Auth Lock-in</TableCell>
                        <TableCell className="text-slate-400"><span className="text-amber-400 font-semibold">Medium:</span> GoTrue is open-source, but migrating password hashes is complex.</TableCell>
                        <TableCell className="text-slate-400"><span className="text-emerald-400 font-semibold">Low:</span> If using custom auth (Passport.js), you own it. High if using Replit Auth.</TableCell>
                      </TableRow>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">Best For...</TableCell>
                        <TableCell className="text-slate-400">Production-ready apps, relational data, decoupled architecture, zero frontend lock-in.</TableCell>
                        <TableCell className="text-slate-400">Fastest prototyping, custom backend servers (Python/AI), all-in-one browser workspace.</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COST TAB */}
          <TabsContent value="cost" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Controls */}
              <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Usage Parameters</CardTitle>
                  <CardDescription className="text-slate-400">Adjust sliders to see cost impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold text-slate-200">Monthly Active Users</Label>
                      <span className="font-mono text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded">{(mau[0] || 1000).toLocaleString()}</span>
                    </div>
                    <Slider 
                      value={mau} 
                      onValueChange={handleMauChange} 
                      min={1000}
                      max={1000000} 
                      step={1000}
                      className="py-4 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                    />
                    <p className="text-xs text-slate-500">Affects compute, bandwidth, and auth limits.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold text-slate-200">Database Size (GB)</Label>
                      <span className="font-mono text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded">{dbSize[0] || 0.5} GB</span>
                    </div>
                    <Slider 
                      value={dbSize} 
                      onValueChange={handleDbSizeChange} 
                      min={0.5}
                      max={100} 
                      step={0.5}
                      className="py-4 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base font-semibold text-slate-200">Storage (GB)</Label>
                      <span className="font-mono text-sm bg-slate-800 text-slate-300 px-2 py-1 rounded">{storage[0] || 1} GB</span>
                    </div>
                    <Slider 
                      value={storage} 
                      onValueChange={handleStorageChange} 
                      min={1}
                      max={500} 
                      step={1}
                      className="py-4 [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results & Chart */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-950/20 border-blue-500/20">
                    <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                      <p className="text-sm font-medium text-blue-400 mb-2">Lovable + Supabase</p>
                      <div className="text-4xl font-bold text-blue-300">${currentCosts.lovable}</div>
                      <p className="text-xs text-blue-400/70 mt-2">per month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#E84A27]/10 border-[#E84A27]/20">
                    <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                      <p className="text-sm font-medium text-[#E84A27] mb-2">Replit</p>
                      <div className="text-4xl font-bold text-[#E84A27]">${currentCosts.replit}</div>
                      <p className="text-xs text-[#E84A27]/70 mt-2">per month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Cost Scaling</CardTitle>
                    <CardDescription className="text-slate-400">Estimated monthly cost as your user base grows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorLovable" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReplit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E84A27" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#E84A27" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                          <YAxis tickFormatter={(value) => `$${value}`} tick={{fontSize: 12, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, '']}
                            labelFormatter={(label) => `${label} Users`}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                            itemStyle={{ color: '#f1f5f9' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
                          <Area type="monotone" dataKey="Lovable + Supabase" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLovable)" />
                          <Area type="monotone" dataKey="Replit" stroke="#E84A27" strokeWidth={2} fillOpacity={1} fill="url(#colorReplit)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </main>

      {/* University Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto border-t-2 border-[#E84A27]">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} University of Illinois at Urbana-Champaign</p>
            <p className="mt-1">IlliniXchange Development Team</p>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
