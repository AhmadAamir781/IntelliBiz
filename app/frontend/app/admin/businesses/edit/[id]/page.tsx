"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { businessApi } from "@/lib/api";

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = Number(params?.id);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      try {
        const res = await businessApi.getBusinessById(businessId);
        setForm(res.data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch business details.");
      } finally {
        setLoading(false);
      }
    };
    if (businessId) fetchBusiness();
  }, [businessId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await businessApi.updateBusiness(businessId, form);
      if (res && res.data) {
        toast.success("Business updated successfully.");
        router.push("/admin/businesses");
      } else {
        toast.error(res.message || "Failed to update business.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update business.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }
  if (!form) {
    return <div className="flex items-center justify-center min-h-screen">Business not found.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit Business</CardTitle>
          <CardDescription>Update the details of the business.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Business Name" value={form.name} onChange={handleChange} required />
            <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
            <Input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
            <Input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} required />
            <Input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="website" placeholder="Website (optional)" value={form.website} onChange={handleChange} />
            <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 