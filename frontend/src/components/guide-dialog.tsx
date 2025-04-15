"use client"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/registry/new-york-v4/ui/dialog";
import { Separator } from "@/registry/new-york-v4/ui/separator";

export const GuideDialogContent = () => {
    return (
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Hướng dẫn chi tiết</DialogTitle>
                <DialogDescription>
                    Các bước chi tiết để sử dụng Papery hiệu quả
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold">Bước 1: Tạo dự án</h3>
                    <p className="text-sm text-muted-foreground">
                        Tạo không gian làm việc riêng cho từng dự án. Mỗi dự án sẽ có:<br />
                        - Không gian chat riêng biệt<br />
                        - Tài liệu được phân loại theo dự án<br />
                        - Cài đặt và quyền riêng
                    </p>
                </div>
                <Separator />
                <div className="space-y-2">
                    <h3 className="font-semibold">Bước 2: Tải lên tài liệu</h3>
                    <p className="text-sm text-muted-foreground">
                        Hỗ trợ nhiều định dạng tài liệu:<br />
                        - PDF, DOCX, TXT<br />
                        - Hình ảnh và bảng tính<br />
                        - Tự động nhận diện ngôn ngữ<br />
                        - Giữ nguyên định dạng gốc
                    </p>
                </div>
                <Separator />
                <div className="space-y-2">
                    <h3 className="font-semibold">Bước 3: Chat với tài liệu</h3>
                    <p className="text-sm text-muted-foreground">
                        Tương tác thông minh với tài liệu:<br />
                        - Đặt câu hỏi về nội dung<br />
                        - Yêu cầu tóm tắt<br />
                        - Phân tích và so sánh<br />
                        - Tìm kiếm thông tin
                    </p>
                </div>
            </div>
        </DialogContent>
    );
};
