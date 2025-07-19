import { useState } from 'react';
import { MessageCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 0,
      question: "When do you typically go to bed on weekdays?",
      options: ["Before 9 PM", "9-10 PM", "10-11 PM", "11 PM-12 AM", "After 12 AM"],
      category: "Sleep Schedule"
    },
    {
      id: 1,
      question: "How often do you experience difficulty falling asleep?",
      options: ["Never", "Rarely (1-2 times/month)", "Sometimes (1-2 times/week)", "Often (3-4 times/week)", "Every night"],
      category: "Sleep Onset"
    },
    {
      id: 2,
      question: "What best describes your bedroom environment?",
      options: ["Very dark and quiet", "Mostly dark with minimal noise", "Some light/noise present", "Bright or noisy", "Very bright and/or very noisy"],
      category: "Environment"
    },
    {
      id: 3,
      question: "How much caffeine do you consume daily?",
      options: ["None", "1 cup coffee/tea", "2-3 cups", "4-5 cups", "More than 5 cups"],
      category: "Lifestyle"
    },
    {
      id: 4,
      question: "When do you typically stop using electronic devices before bed?",
      options: ["2+ hours before", "1-2 hours before", "30-60 minutes before", "Right before bed", "I use devices in bed"],
      category: "Digital Habits"
    }
  ];

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sleep rounded-full shadow-sleep">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Sleep Assessment</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Help us understand your sleep patterns to provide personalized insights
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="text-sm font-medium text-primary-glow">
              {questions[currentQuestion].category}
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                  {answers[currentQuestion] === option && (
                    <CheckCircle className="w-5 h-5 text-primary-glow" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuestion
                    ? "bg-primary-glow"
                    : answers[index]
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            variant={isLastQuestion ? "sleep" : "default"}
            onClick={nextQuestion}
            disabled={!isAnswered || (isLastQuestion && Object.keys(answers).length < questions.length)}
          >
            {isLastQuestion ? "Complete Assessment" : "Next"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questions;