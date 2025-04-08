import React, { useEffect, useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from "axios";
import HorizontalCarousel from '../horizontal-carousel/HorizontalCarousel';
import BuildWardrobe from '../build-wardrobe/BuildWardrobe';
import Loader from '../loader';

const HomeScreen = () => {
    const [view, setView] = useState("shopping");
    const [loadingWardrobeMatch, setloadingWardrobeMatch] = useState(true)
    const [wardrobeMatchData, setWardrobeMatchData] = useState([])
    const [marketplaceData, setmarketplaceData] = useState([])

    async function getOutfitRecommendation() {
        try {
            const response = await axios.post("/api/outfit-recommendation", {
                userData: {
                    gender: "male",
                    height: "180cm",
                    skinTone: "medium",
                    bodyType: "athletic",
                    stylePreference: "casual",
                },
                weatherData: {
                    temperature: 25,
                    condition: "sunny",
                    humidity: 60,
                    windSpeed: 10,
                    city: "Bangalore",
                    country: "India",
                },
            });
            buildMatchWardrobe(response.data.recommendation)
            getMarketPlaceData('male', response.data.recommendation)
            console.log("Recommended Outfit:", response.data.recommendation);
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => { getOutfitRecommendation() }, [])


    const getMarketPlaceData = async (gender, preferences) => {
        try {
            const responseKeywords = await fetch('/api/search-marketplace-keyword', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gender, preferences }), });
            const dataKeywords = await responseKeywords.json();
            const res = await fetch(`/api/shopping-scrap?keyword=${encodeURIComponent(dataKeywords.keywords)}`);
            const data = await res.json();
            marketplaceData.length ? '' : setmarketplaceData(data.results.map((item, idx) => { return { id: idx, title: item.title.slice(0,15), description: item.title.slice(0,25), price: item.price, imageUrl: item.image ,url:item.link } }))
            console.log(data)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    const buildMatchWardrobe = async (recommendation) => {
        try {
            setWardrobeMatchData([])
            setloadingWardrobeMatch(true)
            let allWardrobeItems = await axios.get("/api/fetch-user-wardrobe");
            let data = allWardrobeItems.data
            allWardrobeItems.data = allWardrobeItems.data.map((item) => ({
                id: item.id,
                analysis: item.analysis,
                summary: item.summary,
            }));
            console.log(allWardrobeItems.data);
            let response = await fetchMatchingRecommendations(recommendation, allWardrobeItems.data)
            console.log(response)
            data = data.filter((item) => response.includes(item.id))
            data = data.map((item, idx) => {
                return {
                    id: idx,
                    imageUrl: 'data:image/gif;base64,' + item.base64
                }
            })
            setWardrobeMatchData(data)
            console.log(data)
        } catch (error) {
            console.error("Error fetching analysis:", error);
        }

        setloadingWardrobeMatch(false)
    }

    async function fetchMatchingRecommendations(recommendation, dataArray) {
        try {
            const response = await axios.post("/api/match-recommendation", {
                recommendation,
                dataArray,
            });

            return response.data.matchedIds || []; // Return matched IDs
        } catch (error) {
            console.error(
                "Error fetching matching recommendations:",
                error.response?.data?.error || error.message
            );
            return [];
        }
    }



    const productItems = [
        {
            id: '1',
            title: 'Premium Headphones',
            description: 'Noise-cancelling headphones',
            price: 249.99,
            imageUrl: '/images/headphones.jpg'
        },
        {
            id: '2',
            title: 'Smart Watch',
            description: 'Fitness and health tracking',
            price: 199.99,
            imageUrl: '/images/smartwatch.jpg'
        },
        {
            id: '3',
            title: 'Smart Watch',
            description: 'Fitness and health tracking',
            price: 199.99,
            imageUrl: '/images/smartwatch.jpg'
        },
        {
            id: '4',
            title: 'Smart Watch',
            description: 'Fitness and health tracking',
            price: 199.99,
            imageUrl: '/images/smartwatch.jpg'
        },
        {
            id: '5',
            title: 'Smart Watch',
            description: 'Fitness and health tracking',
            price: 199.99,
            imageUrl: '/images/smartwatch.jpg'
        },
        {
            id: '6',
            title: 'Smart Watch',
            description: 'Fitness and health tracking',
            price: 199.99,
            imageUrl: '/images/smartwatch.jpg'
        },

    ];

    return (
        <div className="max-w-md mx-auto bg-white h-screen flex flex-col">
            {/* Header */}
            <div className="bg-[rgb(249,60,102)] p-4 text-white">


                {/* Search bar */}
                <div className="relative mb-4">
                    <div className="flex items-center bg-white rounded-md p-2 text-gray-500">
                        <Search className="h-5 w-5 ml-1 mr-2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 border-none outline-none text-gray-700"
                        />
                        <Mic className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

            </div>

            {/* Offers section */}
            <div className="bg-[rgb(249,60,102)] text-white p-4 rounded-b-2xl">
                <h3 className="font-bold mb-2">UP TO 60% OFF</h3>
                <div className="flex justify-between gap-1">
                    <div className="bg-[rgb(200,50,90)] rounded-lg p-2 text-xs w-1/4">
                        <p>60% OFF</p>
                        <p>+ Extra 5%</p>
                        <div className="flex items-center mt-1">
                            <span className="font-bold">PUMA</span>
                        </div>
                    </div>
                    <div className="bg-[rgb(200,50,90)] rounded-lg p-2 text-xs w-1/4">
                        <p>Deals</p>
                        <p>From ₹529</p>
                        <div className="flex items-center justify-center mt-1">
                            <span className="font-bold">ROPOSO</span>
                        </div>
                    </div>
                    <div className="bg-[rgb(200,50,90)] rounded-lg p-2 text-xs w-1/4">
                        <p>SHOP In</p>
                        <p>10 Mins</p>
                        <div className="flex items-center mt-1">
                            <span className="font-bold">ONDC</span>
                        </div>
                    </div>
                    <div className="bg-[rgb(200,50,90)] rounded-lg p-2 text-xs w-1/4">
                        <p>Smashing</p>
                        <p>Offers</p>
                        <div className="mt-1">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
                                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-center mt-6">
                    <span>Powered By</span>
                    <span className="font-bold ml-1">GLANCE AI</span>
                </div>
            </div>


            {/* View toggle */}
            <Tabs defaultValue={view} onValueChange={setView} className="mb-2 py-4">
                <TabsList className="w-full">
                    <TabsTrigger value="shopping" className="flex-1">VOGUE AI Feed</TabsTrigger>
                    <TabsTrigger value="manage" className="flex-1">Manage Wardrobe</TabsTrigger>
                </TabsList>
            </Tabs>
            {view === 'shopping' && <div> <div className='mb-6'>  {loadingWardrobeMatch ? <Loader /> : <HorizontalCarousel items={wardrobeMatchData} title="Wardrobe Matches" id='wardrobe' />} </div><div className='mb-6'> <HorizontalCarousel items={marketplaceData} title="Ready in 10 Min – Nearby Store" /> </div></div>}
            {view === 'manage' && <div><BuildWardrobe /></div>}
        </div>
    );
};

export default HomeScreen;