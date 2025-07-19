import { BarChart3, TrendingUp, Calendar, Award, Clock, Moon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Progress = () => {
  const weeklyData = [
    { day: 'Mon', quality: 6, duration: 7.2, fallAsleep: 25 },
    { day: 'Tue', quality: 7, duration: 7.5, fallAsleep: 20 },
    { day: 'Wed', quality: 5, duration: 6.8, fallAsleep: 35 },
    { day: 'Thu', quality: 8, duration: 8.0, fallAsleep: 15 },
    { day: 'Fri', quality: 7, duration: 7.8, fallAsleep: 18 },
    { day: 'Sat', quality: 9, duration: 8.5, fallAsleep: 10 },
    { day: 'Sun', quality: 8, duration: 8.2, fallAsleep: 12 }
  ];

  const insights = [
    {
      title: "Sleep Quality Improving",
      description: "Your average sleep quality has increased by 25% this week",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Consistent Bedtime",
      description: "You've maintained your target bedtime 5 out of 7 days",
      trend: "stable",
      icon: Clock,
      color: "text-primary-glow"
    },
    {
      title: "Faster Sleep Onset",
      description: "Time to fall asleep has decreased by 40% on average",
      trend: "up",
      icon: Moon,
      color: "text-green-600"
    }
  ];

  const goals = [
    { name: "Sleep Quality Score", current: 75, target: 85, unit: "%" },
    { name: "Average Sleep Duration", current: 7.6, target: 8.0, unit: "hrs" },
    { name: "Bedtime Consistency", current: 71, target: 90, unit: "%" },
    { name: "Time to Fall Asleep", current: 19, target: 15, unit: "min" }
  ];

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sleep rounded-full shadow-sleep">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Track your sleep improvements and see how your habits are changing over time
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center shadow-soft">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">7.6</div>
              <div className="text-sm text-muted-foreground">Avg Sleep (hrs)</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-soft">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-soft">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">19</div>
              <div className="text-sm text-muted-foreground">Min to Sleep</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-soft">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">5/7</div>
              <div className="text-sm text-muted-foreground">Days on Track</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-glow" />
              This Week's Sleep Pattern
            </CardTitle>
            <CardDescription>Daily sleep quality, duration, and time to fall asleep</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{day.day}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{day.duration}h sleep</span>
                      <span>{day.fallAsleep}min to sleep</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16">Quality:</span>
                    <ProgressBar value={day.quality * 10} className="flex-1 h-2" />
                    <span className="text-xs w-8">{day.quality}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-glow" />
              Key Insights
            </CardTitle>
            <CardDescription>What your data tells us about your sleep improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="mt-0.5">
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <Badge variant="outline" className={insight.color}>
                  {insight.trend === 'up' ? 'Improving' : 'Stable'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Goal Tracking */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
            <CardDescription>How close you are to achieving your sleep goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal, index) => {
              const progress = goal.name === "Time to Fall Asleep" 
                ? ((goal.target / goal.current) * 100) // Inverted for time (lower is better)
                : ((goal.current / goal.target) * 100);
              
              const displayProgress = Math.min(progress, 100);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}{goal.unit} / {goal.target}{goal.unit}
                    </span>
                  </div>
                  <ProgressBar value={displayProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round(displayProgress)}% of target achieved
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;