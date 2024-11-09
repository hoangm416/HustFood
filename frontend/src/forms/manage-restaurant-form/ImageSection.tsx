import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ImageSection = () => {
    const { control } = useFormContext();

    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold">Image</h2>
                <FormDescription>
                    Thêm hình ảnh sẽ được hiển thị trên danh sách nhà hàng của bạn trong 
                    kết quả tìm kiếm. Thêm hình ảnh mới sẽ ghi đè hình nahr hiện có
                </FormDescription>
            </div>
            <div className="flex flex-col gap-8 md:w-[50%]">
                <FormField
                  control={control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                              className="bg-white" 
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              onChange={(event) =>
                                field.onChange(
                                  event.target.files ? event.target.files[0] : null
                                )
                              }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>
    );
};

export default ImageSection;