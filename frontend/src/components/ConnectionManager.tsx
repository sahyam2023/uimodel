import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataSource } from '@/lib/dataSources';
import { Loader2 } from 'lucide-react';

interface ConnectionManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dataSource: DataSource | undefined;
  onAddConnection: (sourceId: string) => void;
  onDisconnectOne: (sourceId: string) => void;
  isAddingConnection: boolean;
  isDisconnectingConnection: boolean;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  isOpen,
  onOpenChange,
  dataSource,
  onAddConnection,
  onDisconnectOne,
  isAddingConnection,
  isDisconnectingConnection,
}) => {
  if (!dataSource) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Manage {dataSource.name} Connections</DialogTitle>
          <DialogDescription>
            You have {dataSource.connections} active connection(s).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <p className="text-sm text-slate-400">
                You can add a new connection which will simulate a new session to your data source.
            </p>
            <Button
                onClick={() => onAddConnection(dataSource.id)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isAddingConnection || isDisconnectingConnection}
            >
                {isAddingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add a new connection
            </Button>
            <p className="text-sm text-slate-400 pt-4">
                Disconnect a single connection. The data source will remain connected if multiple connections exist.
            </p>
            <Button
                onClick={() => onDisconnectOne(dataSource.id)}
                variant="destructive"
                className="w-full"
                disabled={dataSource.connections < 1 || isAddingConnection || isDisconnectingConnection}
            >
                {isDisconnectingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Disconnect
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};