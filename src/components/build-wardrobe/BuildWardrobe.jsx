"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ImageShowcaseCard from "../wardrobe-item";
import Loader from "../loader";
import { promise } from "zod";

const BuildWardrobe = () => {
    const [open, setOpen] = useState(false);
    const [openMarketplace, setOpenMarketplace] = useState(false);
    const [marketplaceImage, setmarketplaceImage] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [wardrobeData, setWardrobeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderHistory, setOrderHistory] = useState(null)
    const [orderHistoryState, setOrderHistoryState] = useState({ loading: false, message: '' })


    const fetchAnalysis = async () => {
        try {
            const response = await axios.get("/api/fetch-user-wardrobe");
            setWardrobeData(response.data.reverse());
        } catch (error) {
            console.error("Error fetching analysis:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        // Here you would typically handle the upload
        console.log('Uploading image:', selectedImage);
        handleUpload(selectedImage)
        // Reset state
        setSelectedImage(null);
        setPreviewUrl(null);
        // Close dialog
        setOpen(false);
    };


    const handleClose = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setOpen(false);
    };

    const handleUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        setLoading(true);
        const res = await fetch("/api/analyze-image", { method: "POST", body: formData });
        const data = await res.json();
        fetchAnalysis()
        console.log(data)
    };

    const syncMarketPlace = async () => {
        setOrderHistoryState({ loading: true, message: 'Syncing Order Data' });

        try {
            const { data } = await axios.post('/api/amazon-sync', { email, password });
            let orderHtmlBlocks = data?.orderHtmlBlocks || [];

            console.log('✅ Orders fetched:', orderHtmlBlocks.length);
            orderHtmlBlocks = orderHtmlBlocks.slice(0, 5)
            const extractedData = await Promise.all(
                orderHtmlBlocks.map(extractTitleAndImage)
            );

            console.log('✅ Extracted order data:', extractedData);
            setOrderHistory(extractedData);

            return extractedData;
        } catch (error) {
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.error || error.message
                : String(error);

            console.error('❌ Sync failed:', errorMessage);
        } finally {
            setOrderHistoryState({ loading: false, message: '' });
        }
    };


    async function urlToFile(url, filename, mimeType) {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        return new File([buffer], filename, { type: mimeType });
    }

    async function convertAllUrlsToFiles(urls) {
        const files = await Promise.all(
            urls.map((url, index) => {
                const ext = url.split('.').pop();
                const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
                return urlToFile(url, `image${index}.${ext}`, mimeType);
            })
        );
        return files;
    }

    const addOrderHistoryToWardrobe = async () => {
        try {
            if (!orderHistory?.length) return;
            setOrderHistoryState({ loading: true, message: 'Adding Order Data to wardrobe' });
            const imageUrls = orderHistory.map(item => item.imageUrl).filter(Boolean); // filter out null/undefined
            const fileObjects = await convertAllUrlsToFiles(imageUrls);
            await Promise.all(fileObjects.map(file => handleUpload(file)));
            setOrderHistory(null);
            setOpenMarketplace(false)
        } catch (error) {
            console.error('Failed to add order history:', error);
            setOrderHistoryState({ loading: false, message: 'Failed to add order data.' });
            return;
        }
        setOrderHistoryState({ loading: false, message: '' });
    };


    async function extractTitleAndImage(htmlContent) {
        try {
            const response = await fetch("/api/order-data-detail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ htmlContent })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to extract content");
            }

            console.log("Title:", data.title);
            console.log("Image URL:", data.imageUrl);

            return data;
        } catch (error) {
            console.error("Error during API call:", error);
            return null;
        }
    }


    useEffect(() => { fetchAnalysis() }, [])

    return (
        <>

            <div className="flex items-center justify-between px-4">

                <div className="flex flex-col items-center">
                    <button onClick={() => setOpen(true)} className="w-14 h-14 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm mb-2"> <img src="https://www.shutterstock.com/image-vector/add-plus-medical-cross-round-600nw-2107967882.jpg" alt="Amazon logo" className=" rounded-full" /> </button>
                    <span className="text-xs font-medium text-gray-700">Quick Add</span>
                </div>
                <div onClick={() => { setOpenMarketplace(true); setmarketplaceImage('https://www.shutterstock.com/image-illustration/karachi-pakistan-10-september-amazon-600nw-2359134545.jpg') }} className="flex flex-col items-center">
                    <button className="w-14 h-14 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm mb-2"> <img src="https://www.shutterstock.com/image-illustration/karachi-pakistan-10-september-amazon-600nw-2359134545.jpg" alt="Amazon logo" className="w-10 h-10 rounded-full" /> </button>
                    <span className="text-xs font-medium text-gray-700">Sync Amazon</span>
                </div>
                <div onClick={() => { setOpenMarketplace(true); setmarketplaceImage('https://static.vecteezy.com/system/resources/previews/054/650/802/non_2x/flipkart-logo-rounded-flipkart-logo-free-download-flipkart-logo-free-png.png') }} className="flex flex-col items-center">
                    <button className="w-14 h-14 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm mb-2"> <img src="https://static.vecteezy.com/system/resources/previews/054/650/802/non_2x/flipkart-logo-rounded-flipkart-logo-free-download-flipkart-logo-free-png.png" alt="Amazon logo" className="w-10 h-10 rounded-full" /> </button>
                    <span className="text-xs font-medium text-gray-700">Sync Flipkart</span>
                </div>
                <div onClick={() => { setOpenMarketplace(true); setmarketplaceImage('https://static.vecteezy.com/system/resources/previews/050/816/807/non_2x/meesho-transparent-icon-free-png.png') }} className="flex flex-col items-center">
                    <button className="w-14 h-14 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm mb-2"> <img src="https://static.vecteezy.com/system/resources/previews/050/816/807/non_2x/meesho-transparent-icon-free-png.png" alt="Amazon logo" className="w-12 h-12 rounded-full" /> </button>
                    <span className="text-xs font-medium text-gray-700">Sync Meesho</span>
                </div>

                <Dialog open={openMarketplace} onOpenChange={setOpenMarketplace}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="flex justify-center mb-0">
                                <img src={marketplaceImage} alt="Amazon logo" className="h-16" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-center">Sign In to Sync Orders with Vogue AI</DialogTitle>
                        </DialogHeader>
                        {orderHistoryState.loading ? <Loader color="#FF4785" secondaryColor="#00D1B2" size="sm" text={orderHistoryState.message} /> : (
                            orderHistory !== null ?
                                <div>
                                    <div className="flex flex-wrap py-8 max-h-[60vh] overflow-auto"> {orderHistory.map((item, index) => <ImageShowcaseCard imageUrl={item.imageUrl} key={index} maxWidth='135px' />)} </div>
                                    <Button onClick={addOrderHistoryToWardrobe} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2">
                                        Add to Wardrobe
                                    </Button>
                                </div>
                                :
                                <form onSubmit={(e) => { e.preventDefault(); syncMarketPlace() }} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Enter mobile number or email</Label>
                                        <Input
                                            id="email"
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border rounded-md"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border rounded-md"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2"
                                    >
                                        Continue
                                    </Button>

                                    <p className="text-sm text-gray-600 text-center">
                                        By continuing, you agree to VOGUE AI{' '}
                                        <a href="#" className="text-blue-600">Conditions of Use</a>{' '}
                                        and{' '}
                                        <a href="#" className="text-blue-600">Privacy Notice</a>.
                                    </p>
                                </form>
                        )}

                    </DialogContent>
                </Dialog>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-md max-w-sm mx-auto">
                        <DialogHeader>
                            <DialogTitle>Upload Image</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-2">
                                {previewUrl ? (
                                    <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setPreviewUrl(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 w-full flex flex-col items-center">
                                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                        <Label
                                            htmlFor="image-upload"
                                            className="cursor-pointer py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Choose Image
                                        </Label>
                                        <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF</p>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                disabled={!selectedImage}
                                onClick={handleSubmit}
                            >
                                Add
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-wrap py-8">
                {loading ? <Loader color="#FF4785" secondaryColor="#00D1B2" size="sm" text="Vibe checking" /> : wardrobeData.map((item, index) => (<ImageShowcaseCard imageUrl={'data:image/gif;base64,' + item.base64} key={index} />))}
            </div>

        </>
    );
};

export default BuildWardrobe;