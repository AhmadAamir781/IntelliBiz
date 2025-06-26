"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { businessApi } from "@/lib/api";

export default function AddBusinessPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.address || !form.city || !form.state || !form.zipCode || !form.phoneNumber || !form.email) {
      toast.error("All required fields must be filled.");
      return;
    }
    setLoading(true);
    try {
      const res = await businessApi.createBusiness(form);
      if (res && res.data) {
        toast.success("Business added successfully.");
        router.push("/admin/businesses");
      } else {
        toast.error(res.message || "Failed to add business.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to add business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Business</CardTitle>
          <CardDescription>Fill in the details to add a new business.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Business Name" value={form.name} onChange={handleChange} disabled={loading} required />
            <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} disabled={loading} required />
            <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} disabled={loading} required />
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} disabled={loading} required />
            <Input name="state" placeholder="State" value={form.state} onChange={handleChange} disabled={loading} required />
            <Input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} disabled={loading} required />
            <Input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} disabled={loading} required />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={loading} required />
            <Input name="website" placeholder="Website (optional)" value={form.website} onChange={handleChange} disabled={loading} />
            <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} disabled={loading} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Business"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 