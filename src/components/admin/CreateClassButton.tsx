'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateClassForm from './CreateClassForm';

interface ClassType {
  id: string;
  name: string;
  color: string;
}

interface Instructor {
  id: string;
  user: { name: string | null };
}

interface CreateClassButtonProps {
  classTypes: ClassType[];
  instructors: Instructor[];
}

export default function CreateClassButton({
  classTypes,
  instructors,
}: CreateClassButtonProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Nueva clase
        </Button>
      )}
      {showForm && (
        <CreateClassForm
          classTypes={classTypes}
          instructors={instructors}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
