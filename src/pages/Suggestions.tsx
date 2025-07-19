import { useState } from 'react';
import { Target, Clock, Moon, Lightbulb, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Suggestions = () => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const suggestions = {
    immediate: [
      {
        id: 'bedtime-routine',
        title: 'Establish a Consistent Bedtime',
        description: 'Based on your responses, try going to bed at 10:30 PM every night for the next week.',
        priority: 'High',
        timeframe: 'This week',
        reason: 'Your irregular sleep schedule is likely contributing to difficulty falling asleep.'
      },
      {
        id: 'screen-time',
        title: 'Reduce Screen Time Before Bed',
        description: 'Stop using devices 1 hour before your target bedtime.',
        priority: 'High',
        timeframe: 'Tonight',
        reason: 'Blue light exposure is interfering with your natural sleep cycle.'
      }
    ],
    weekly: [
      {
        id: 'bedroom-environment',
        title: 'Optimize Your Sleep Environment',
        description: 'Invest in blackout curtains and consider a white noise machine or earplugs.',
        priority: 'Medium',
        timeframe: 'This month',
        reason: 'Environmental factors are disrupting your sleep quality.'
      },
      {
        id: 'caffeine-timing',
        title: 'Adjust Caffeine Intake',
        description: 'Limit caffeine consumption to before 2 PM.',
        priority: 'Medium',
        timeframe: 'Next week',
        reason: 'Late caffeine consumption may be affecting your ability to fall asleep.'
      }
    ],
    longterm: [
      {
        id: 'sleep-hygiene',
        title: 'Complete Sleep Hygiene Protocol',
        description: 'Implement a comprehensive sleep routine including temperature control, aromatherapy, and relaxation techniques.',
        priority: 'Low',
        timeframe: 'Next month',
        reason: 'Building long-term habits will improve overall sleep quality.'
      }
    ]
  };

  const todoItems = [
    { id: 'todo-1', task: 'Set phone to Do Not Disturb at 9:30 PM', category: 'Digital Habits' },
    { id: 'todo-2', task: 'Buy blackout curtains for bedroom', category: 'Environment' },
    { id: 'todo-3', task: 'Create a 30-minute wind-down routine', category: 'Routine' },
    { id: 'todo-4', task: 'Track caffeine intake for one week', category: 'Lifestyle' },
    { id: 'todo-5', task: 'Practice 10 minutes of meditation before bed', category: 'Relaxation' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-primary-glow';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sleep rounded-full shadow-sleep">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Your Sleep Plan</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Personalized recommendations based on your sleep assessment and daily check-ins
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="todo">Action Items</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            {/* Immediate Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold">Immediate Actions</h2>
                <Badge variant="outline" className="text-destructive border-destructive">
                  Start Today
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {suggestions.immediate.map((suggestion) => (
                  <Card key={suggestion.id} className="shadow-soft border-l-4 border-l-destructive">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} Priority
                            </Badge>
                            <Badge variant="outline">{suggestion.timeframe}</Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {suggestion.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-primary-glow mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Weekly Goals</h2>
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  This Week
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {suggestions.weekly.map((suggestion) => (
                  <Card key={suggestion.id} className="shadow-soft border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} Priority
                            </Badge>
                            <Badge variant="outline">{suggestion.timeframe}</Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {suggestion.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-primary-glow mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Long-term Goals */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary-glow" />
                <h2 className="text-xl font-semibold">Long-term Goals</h2>
                <Badge variant="outline" className="text-primary-glow border-primary-glow">
                  Next Month
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {suggestions.longterm.map((suggestion) => (
                  <Card key={suggestion.id} className="shadow-soft border-l-4 border-l-primary-glow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} Priority
                            </Badge>
                            <Badge variant="outline">{suggestion.timeframe}</Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {suggestion.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-primary-glow mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="todo" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Action Items</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Task
              </Button>
            </div>

            <div className="grid gap-3">
              {todoItems.map((item) => (
                <Card 
                  key={item.id} 
                  className={`shadow-soft transition-all duration-300 cursor-pointer hover:shadow-sleep ${
                    completedTasks.has(item.id) ? 'bg-accent/30' : ''
                  }`}
                  onClick={() => toggleTask(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                        ${completedTasks.has(item.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground hover:border-primary'
                        }
                      `}>
                        {completedTasks.has(item.id) && (
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`${
                          completedTasks.has(item.id) ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {item.task}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Completed {completedTasks.size} of {todoItems.length} tasks
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-glow h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks.size / todoItems.length) * 100}%` }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Suggestions;