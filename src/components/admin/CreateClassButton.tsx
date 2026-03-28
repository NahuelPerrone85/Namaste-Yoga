'use client';

import { useState } from 'react';
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
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            backgroundColor: '#7C6BC4',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Nueva clase
        </button>
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
