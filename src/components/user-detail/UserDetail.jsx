import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProfileForm = () => {
  const [skinToneValue, setSkinToneValue] = useState(50);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const form = useForm({
    defaultValues: {
      gender: '',
      age: '',
      height: '',
      heightUnit: 'cm',
      weight: '',
      weightUnit: 'kg',
      skinTone: 'Medium',
      bodyType: ''
    }
  });

  // Load saved data on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('userProfileData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
      
      // Set skin tone slider value if available
      if (parsedData.skinToneValue) {
        setSkinToneValue(parsedData.skinToneValue);
      }
    }
  }, [form]);

  // Map slider value to skin tone
  const getSkinToneFromValue = (value) => {
    if (value < 20) return 'Fair';
    if (value < 40) return 'Medium';
    if (value < 60) return 'Olive';
    if (value < 80) return 'Dark';
    return 'Custom';
  };

  // Get skin tone color for the slider
  const getSkinToneColor = (value) => {
    const colors = {
      Fair: '#FFDFC4',
      Medium: '#F0C8A0',
      Olive: '#D4A26A',
      Dark: '#8D5524',
      Custom: `rgb(${Math.min(255, 240 - value)}, ${Math.min(200, 180 - value * 0.5)}, ${Math.min(170, 150 - value)})`
    };
    
    return colors[getSkinToneFromValue(value)] || colors.Custom;
  };

  const onSubmit = (data) => {
    // Add the skin tone value to the data
    const completeData = {
      ...data,
      skinTone: getSkinToneFromValue(skinToneValue),
      skinToneValue
    };
    
    try {
      // Store in localStorage
      localStorage.setItem('userProfileData', JSON.stringify(completeData));
      setSubmitStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error saving data:', error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Setup Profile</CardTitle>
        <CardDescription>Please fill out your profile details</CardDescription>
      </CardHeader>
      
      <CardContent>
        {submitStatus === 'success' && (
          <Alert className="mb-6 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your profile has been saved successfully.</AlertDescription>
          </Alert>
        )}
        
        {submitStatus === 'error' && (
          <Alert className="mb-6 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>There was an error saving your profile. Please try again.</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Age Field */}
            <FormField
              control={form.control}
              name="age"
              rules={{ 
                required: "Age is required",
                min: { value: 18, message: "Age must be at least 18" },
                max: { value: 120, message: "Age must be less than 120" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter your age" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Height Field */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                rules={{ required: "Height is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter height" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="heightUnit"
                render={({ field }) => (
                  <FormItem className="pt-8">
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Weight Field (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter weight" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weightUnit"
                render={({ field }) => (
                  <FormItem className="pt-8">
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Skin Tone Field */}
            <FormItem>
              <FormLabel>Skin Tone</FormLabel>
              <div className="space-y-2">
                <div 
                  className="w-full h-8 rounded-md" 
                  style={{ backgroundColor: getSkinToneColor(skinToneValue) }}
                />
                <Slider
                  value={[skinToneValue]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => {
                    setSkinToneValue(value);
                    form.setValue('skinTone', getSkinToneFromValue(value));
                  }}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Fair</span>
                  <span>Medium</span>
                  <span>Olive</span>
                  <span>Dark</span>
                  <span>Custom</span>
                </div>
              </div>
              <FormDescription>
                Selected: {getSkinToneFromValue(skinToneValue)}
              </FormDescription>
            </FormItem>
            
            {/* Body Type Field */}
            <FormField
              control={form.control}
              name="bodyType"
              rules={{ required: "Body type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Slim">Slim</SelectItem>
                      <SelectItem value="Athletic">Athletic</SelectItem>
                      <SelectItem value="Curvy">Curvy</SelectItem>
                      <SelectItem value="Plus-size">Plus-size</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;