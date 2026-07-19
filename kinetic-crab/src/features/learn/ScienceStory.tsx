import React, { useState } from 'react';
import { StoryViewer } from './StoryViewer';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';

// Hard‑coded topics for demonstration – can be replaced with a dynamic list later
const DEFAULT_TOPICS = [
  { id: 'photosynthesis', title: 'Photosynthesis', subject: 'Science' },
  { id: 'gravity', title: 'Gravity', subject: 'Science' },
  { id: 'fractions', title: 'Fractions', subject: 'Math' },
];

export const ScienceStory: React.FC = () => {
  const [selected, setSelected] = useState<{ title: string; subject: string } | null>(null);

  const startStory = (topic: string, subject: string) => {
    setSelected({ title: topic, subject });
  };

  const reset = () => setSelected(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 gap-8">
      {!selected && (
        <Card className="max-w-2xl w-full bg-gradient-to-br from-indigo-900 to-purple-900 border-0 shadow-2xl">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <BookOpen className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white">Science Story Adventure</CardTitle>
            <CardDescription className="text-white/80">
              Choose a topic and let Professor Crab guide you through a short, interactive story.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {DEFAULT_TOPICS.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center justify-between"
                onClick={() => startStory(t.title, t.subject)}
              >
                <span className="font-medium">{t.title}</span>
                <span className="opacity-70 text-sm">{t.subject}</span>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      )}
      {selected && (
        <StoryViewer
          topic={selected.title}
          subject={selected.subject}
          onComplete={reset}
        />
      )}
    </div>
  );
};
