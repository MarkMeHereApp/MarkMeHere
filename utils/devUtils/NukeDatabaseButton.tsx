'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from 'components/ui/button';
import { toast } from '../../components/ui/use-toast';

const NukeDatabaseButton = () => {
  const deleteDatabaseMutation = trpc.utils.deleteDatabase.useMutation();

  const handleNukeClick = async () => {
    await deleteDatabaseMutation.mutateAsync();
    toast({
      title: 'Database Nuked!',
      description: 'The database has been nuked!',
      icon: 'success'
    });
    window.location.reload();
  };

  return (
    <Button variant="destructive" onClick={handleNukeClick}>
      Nuke the Database!!!
    </Button>
  );
};

export default NukeDatabaseButton;
