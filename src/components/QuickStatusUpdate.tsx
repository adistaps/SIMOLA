
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useUpdateReport, ReportStatus } from "@/hooks/useReports";

interface QuickStatusUpdateProps {
  reportId: string;
  currentStatus: ReportStatus;
  reportNumber: string;
}

const QuickStatusUpdate = ({ reportId, currentStatus, reportNumber }: QuickStatusUpdateProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(currentStatus);
  const updateReportMutation = useUpdateReport();

  const handleStatusUpdate = () => {
    if (selectedStatus !== currentStatus) {
      const updates = { status: selectedStatus };
      updateReportMutation.mutate({ id: reportId, updates });
      setOpen(false);
    }
  };

  const statusLabels = {
    menunggu: "Menunggu",
    diproses: "Diproses", 
    selesai: "Selesai",
    ditolak: "Ditolak"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border hover:bg-muted">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Update Status Laporan</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update status laporan {reportNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedStatus} onValueChange={(value: ReportStatus) => setSelectedStatus(value)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="menunggu">{statusLabels.menunggu}</SelectItem>
              <SelectItem value="diproses">{statusLabels.diproses}</SelectItem>
              <SelectItem value="selesai">{statusLabels.selesai}</SelectItem>
              <SelectItem value="ditolak">{statusLabels.ditolak}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            Batal
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            disabled={selectedStatus === currentStatus || updateReportMutation.isPending}
          >
            {updateReportMutation.isPending ? "Menyimpan..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickStatusUpdate;
