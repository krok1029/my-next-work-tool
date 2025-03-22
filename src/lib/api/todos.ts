import { mutate } from 'swr';

export const consumePomodoro = async (id: number) => {
  try {
    const response = await fetch(`/api/todos/${id}/consume_pomodoro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      mutate('/api/todos');
    } else {
      console.error('Failed to consume pomodoro');
    }
  } catch (error) {
    console.error('Error consuming pomodoro:', error);
  }
};
