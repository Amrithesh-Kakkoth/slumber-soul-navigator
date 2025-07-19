import { Moon, Stars, Heart, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="space-y-8 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-sleep rounded-full shadow-sleep mb-4">
          <Moon className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-night bg-clip-text text-transparent">
            Sleep Wellness Coach
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal AI companion to identify sleep patterns, understand root causes of insomnia, 
            and guide you toward better rest through personalized insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/checkin">
            <Button size="lg" variant="sleep">
              Start Daily Check-in
            </Button>
          </Link>
          <Link to="/questions">
            <Button size="lg" variant="calm">
              Begin Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-sleep transition-all duration-300">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2 mx-auto">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg">Daily Check-ins</CardTitle>
            <CardDescription>
              Track your sleep patterns with guided daily assessments
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-sleep transition-all duration-300">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2 mx-auto">
              <Stars className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
            <CardDescription>
              Smart questions that adapt to find your sleep challenges
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-sleep transition-all duration-300">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-full mb-2 mx-auto">
              <Target className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg">Action Plans</CardTitle>
            <CardDescription>
              Personalized recommendations and actionable next steps
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-glow" />
            Your Sleep Journey
          </CardTitle>
          <CardDescription>
            Continue where you left off
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Days tracked</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Consistency score</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/checkin" className="flex-1">
              <Button variant="default" className="w-full">
                Today's Check-in
              </Button>
            </Link>
            <Link to="/suggestions" className="flex-1">
              <Button variant="secondary" className="w-full">
                View Suggestions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;