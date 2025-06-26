"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { businessApi } from "@/lib/api";

export default function BusinessDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = Number(params?.id);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      try {
        const res = await businessApi.getBusinessById(businessId);
        setBusiness(res.data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch business details.");
      } finally {
        setLoading(false);
      }
    };
    if (businessId) fetchBusiness();
  }, [businessId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }
  if (!business) {
    return <div className="flex items-center justify-center min-h-screen">Business not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{business.name}</CardTitle>
          <CardDescription>{business.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Category:</strong> {business.category}</div>
            <div><strong>Address:</strong> {business.address}, {business.city}, {business.state}, {business.zipCode}</div>
            <div><strong>Phone:</strong> {business.phoneNumber}</div>
            <div><strong>Email:</strong> {business.email}</div>
            {business.website && <div><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{business.website}</a></div>}
            <div><strong>Status:</strong> {business.isVerified ? "Verified" : "Pending"}</div>
            <div><strong>Created At:</strong> {business.createdAt}</div>
            <div><strong>Updated At:</strong> {business.updatedAt}</div>
          </div>
          <Button className="mt-6" variant="outline" onClick={() => router.push("/admin/businesses")}>Back to Businesses</Button>
        </CardContent>
      </Card>
    </div>
  );
} 