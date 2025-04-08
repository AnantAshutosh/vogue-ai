'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, AlertCircle, Check, CloudRain } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

export default function LocationShare() {
  const [locationStatus, setLocationStatus] = useState('idle')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const savedData = sessionStorage.getItem('userLocationData')
    if (savedData) {
      const { latitude, longitude, weather } = JSON.parse(savedData)
      setLocation({ latitude, longitude })
      setWeather(weather)
      setLocationStatus('success')
    }
  }, [])

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://wttr.in/${latitude},${longitude}?format=%C+%t`)
      const data = await response.text()
      setWeather(data)
      
      const userData = { latitude, longitude, weather: data }
      sessionStorage.setItem('userLocationData', JSON.stringify(userData))
    } catch (error) {
      toast.error('Error fetching weather data', { description: error.message })
    }
  }

  const requestLocation = () => {
    setLocationStatus('loading')
    
    if (!navigator.geolocation) {
      setLocationStatus('error')
      toast.error("Location Not Available", {
        description: "Geolocation is not supported by your browser"
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        setLocationStatus('success')
        toast.success("Location Access Granted", {
          description: "Fetching weather data..."
        })
        await fetchWeather(latitude, longitude)
      },
      (error) => {
        setLocationStatus('error')
        toast.error("Location Access Denied", {
          description: error.message
        })
      }
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to Vogue AI</CardTitle>
          <CardDescription>Personalized fashion recommendations based on your location & weather</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 p-6">
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <MapPin size={48} className="text-primary" />
          </div>
          
          {locationStatus === 'success' && location && (
            <Alert variant="default" className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Location successfully detected</AlertTitle>
              <AlertDescription>
                Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
              </AlertDescription>
            </Alert>
          )}

          {weather && (
            <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900">
              <CloudRain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle>Current Weather</AlertTitle>
              <AlertDescription>{weather}</AlertDescription>
            </Alert>
          )}
          
          {locationStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location access denied</AlertTitle>
              <AlertDescription>
                We need your location to provide personalized fashion recommendations
              </AlertDescription>
            </Alert>
          )}
          
          {locationStatus !== 'success' && (
            <p className="text-center text-slate-600 dark:text-slate-400">
              To provide you with weather-appropriate and regionally-inspired fashion recommendations, 
              Vogue AI needs access to your location.
            </p>
          )}
        </CardContent>
        <CardFooter>
          {locationStatus === 'success' ? (
            <Button className="w-full" size="lg">
              Continue to Vogue AI
            </Button>
          ) : (
            <Button 
              className="w-full" 
              size="lg"
              onClick={requestLocation}
              disabled={locationStatus === 'loading'}
            >
              {locationStatus === 'loading' ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Detecting Location...
                </>
              ) : (
                "Share My Location"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
