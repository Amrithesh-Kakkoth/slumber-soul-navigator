import { useState } from 'react';
import { Calendar, Clock, Moon, Sun, Thermometer, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const CheckIn = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState({
    sleepQuality: [6],
    sleepDuration: [7],
    fallAsleepTime: [15],
    stressLevel: [4],
    energy: [5],
    notes: ''
  });

  const handleSubmit = () => {
    toast({
      title: "Check-in submitted",
      description: "Your daily sleep data has been recorded. Keep up the great work!",
    });
  };

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sleep rounded-full shadow-sleep">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Daily Check-In</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Let's track how you slept last night and how you're feeling today
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Sleep Quality */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary-glow" />
              Sleep Quality
            </CardTitle>
            <CardDescription>How would you rate your sleep quality last night?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={responses.sleepQuality}
                onValueChange={(value) => updateResponse('sleepQuality', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Poor (1)</span>
              <span className="font-medium">Rating: {responses.sleepQuality[0]}</span>
              <span>Excellent (10)</span>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Duration */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-glow" />
              Sleep Duration
            </CardTitle>
            <CardDescription>How many hours did you sleep?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={responses.sleepDuration}
                onValueChange={(value) => updateResponse('sleepDuration', value)}
                max={12}
                min={2}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>2 hours</span>
              <span className="font-medium">{responses.sleepDuration[0]} hours</span>
              <span>12+ hours</span>
            </div>
          </CardContent>
        </Card>

        {/* Time to Fall Asleep */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-primary-glow" />
              Time to Fall Asleep
            </CardTitle>
            <CardDescription>How long did it take you to fall asleep?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={responses.fallAsleepTime}
                onValueChange={(value) => updateResponse('fallAsleepTime', value)}
                max={120}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Instantly</span>
              <span className="font-medium">{responses.fallAsleepTime[0]} minutes</span>
              <span>2+ hours</span>
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-glow" />
              Stress Level
            </CardTitle>
            <CardDescription>How stressed did you feel yesterday?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={responses.stressLevel}
                onValueChange={(value) => updateResponse('stressLevel', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Very calm (1)</span>
              <span className="font-medium">Level: {responses.stressLevel[0]}</span>
              <span>Very stressed (10)</span>
            </div>
          </CardContent>
        </Card>

        {/* Energy Level */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary-glow" />
              Energy Level
            </CardTitle>
            <CardDescription>How is your energy level today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={responses.energy}
                onValueChange={(value) => updateResponse('energy', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Exhausted (1)</span>
              <span className="font-medium">Level: {responses.energy[0]}</span>
              <span>Energized (10)</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Anything else about your sleep or how you're feeling? (Optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Had a stressful day at work, took melatonin around 10pm..."
              value={responses.notes}
              onChange={(e) => updateResponse('notes', e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Button 
          onClick={handleSubmit}
          size="lg" 
          variant="sleep" 
          className="w-full"
        >
          Complete Check-In
        </Button>
      </div>
    </div>
  );
};

export default CheckIn;