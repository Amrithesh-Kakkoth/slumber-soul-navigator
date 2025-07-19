import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Moon, Sun, Thermometer, Brain, CheckCircle, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const CheckIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingCheckin, setHasExistingCheckin] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [responses, setResponses] = useState({
    sleepQuality: [6],
    sleepDuration: [7],
    fallAsleepTime: [15],
    stressLevel: [4],
    energy: [5],
    notes: ''
  });

  useEffect(() => {
    // Get current user and check for existing check-in
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check for existing check-in today
        const today = new Date().toISOString().split('T')[0];
        const { data: existingCheckin, error } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', user.id)
          .eq('checkin_date', today)
          .single();

        if (existingCheckin && !error) {
          // Pre-populate form with existing data
          setResponses({
            sleepQuality: [existingCheckin.sleep_quality || 6],
            sleepDuration: [existingCheckin.sleep_duration || 7],
            fallAsleepTime: [existingCheckin.time_to_fall_asleep || 15],
            stressLevel: [existingCheckin.stress_level || 4],
            energy: [existingCheckin.energy_level || 5],
            notes: existingCheckin.notes || ''
          });
          setHasExistingCheckin(true);
          setIsSubmitted(true);
        }
      }
    };

    getCurrentUser();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your check-in.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Check if there's already a check-in for today
      const { data: existingCheckin, error: checkError } = await supabase
        .from('daily_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      const checkinData = {
        user_id: user.id,
        checkin_date: today,
        sleep_quality: responses.sleepQuality[0],
        sleep_duration: responses.sleepDuration[0],
        time_to_fall_asleep: responses.fallAsleepTime[0],
        stress_level: responses.stressLevel[0],
        energy_level: responses.energy[0],
        notes: responses.notes.trim() || null,
      };

      let result;
      if (existingCheckin) {
        // Update existing check-in
        result = await supabase
          .from('daily_checkins')
          .update(checkinData)
          .eq('id', existingCheckin.id);
      } else {
        // Create new check-in
        result = await supabase
          .from('daily_checkins')
          .insert(checkinData);
      }

      if (result.error) throw result.error;

      toast({
        title: existingCheckin ? "Check-in updated" : "Check-in submitted",
        description: "Your daily sleep data has been recorded. Keep up the great work!",
      });

      setIsSubmitted(true);
      setIsEditing(false);
      setHasExistingCheckin(true);
      
    } catch (error: any) {
      console.error('Error submitting check-in:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error saving your check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sleep rounded-full shadow-sleep">
          {isSubmitted && !isEditing ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <Calendar className="w-8 h-8 text-white" />
          )}
        </div>
        <h1 className="text-3xl font-bold">
          {isSubmitted && !isEditing ? "Check-In Complete!" : "Daily Check-In"}
        </h1>
        {hasExistingCheckin && !isEditing && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/50 text-accent-foreground rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Today's check-in completed
          </div>
        )}
        <p className="text-muted-foreground max-w-md mx-auto">
          {isSubmitted && !isEditing 
            ? "Your daily sleep data has been recorded successfully."
            : "Let's track how you slept last night and how you're feeling today"
          }
        </p>
      </div>

      {isSubmitted && !isEditing ? (
        // Submitted State - Show summary and edit option
        <div className="space-y-6 max-w-2xl mx-auto">
          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Today's Check-In Summary
              </CardTitle>
              <CardDescription>
                You've successfully logged your sleep data for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sleep Quality</div>
                  <div className="text-2xl font-bold text-primary">{responses.sleepQuality[0]}/10</div>
                </div>
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sleep Duration</div>
                  <div className="text-2xl font-bold text-primary">{responses.sleepDuration[0]}h</div>
                </div>
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Fall Asleep Time</div>
                  <div className="text-2xl font-bold text-primary">{responses.fallAsleepTime[0]}min</div>
                </div>
                <div className="text-center p-4 bg-accent/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Stress Level</div>
                  <div className="text-2xl font-bold text-primary">{responses.stressLevel[0]}/10</div>
                </div>
              </div>
              <div className="text-center p-4 bg-accent/30 rounded-lg">
                <div className="text-sm text-muted-foreground">Energy Level</div>
                <div className="text-2xl font-bold text-primary">{responses.energy[0]}/10</div>
              </div>
              {responses.notes && (
                <div className="p-4 bg-accent/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Notes</div>
                  <div className="text-sm">{responses.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => setIsEditing(true)}
              size="lg" 
              variant="outline" 
              className="flex-1"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Check-In
            </Button>
            <Button 
              onClick={() => navigate('/progress')}
              size="lg" 
              variant="sleep" 
              className="flex-1"
            >
              View Progress
            </Button>
          </div>
        </div>
      ) : (
        // Form State - Show form for new entry or editing
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
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : hasExistingCheckin ? 'Update Check-In' : 'Complete Check-In'}
        </Button>

        {isEditing && (
          <Button 
            onClick={() => {
              setIsEditing(false);
              setIsSubmitted(true);
            }}
            size="lg" 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>
      )}
    </div>
  );
};

export default CheckIn;