import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    restaurantName: z.string({
        required_error: "tên nhà hàng bắt buộc",
      }),
      city: z.string({
        required_error: "thành phố là bắt buộc",
      }),
      country: z.string({
        required_error: "quôc sgia là bắt buộc",
      }),
      deliveryPrice: z.coerce.number({
        required_error: "giá giao hàng là bắt buộc",
        invalid_type_error: "phải là một số hợp lệ",
      }),
      estimatedDeliveryTime: z.coerce.number({
        required_error: "thời gian giao hàng ước tính là cần thiết",
        invalid_type_error: "phải là một số hợp lệ",
      }),
      cuisines: z.array(z.string()).nonempty({
        message: "vui lòng chọn ít nhất một mục",
      }),
      menuItems: z.array(
        z.object({
          name: z.string().min(1, "tên là bắt buộc"),
          price: z.coerce.number().min(1, "giá cả là bắt buộc"),
        })
      ),
      imageFile: z.instanceof(File, { message: "hình ảnh là bắt buộc" }),
});

type RestaurantFormData = z.infer<typeof formSchema>;

type Props ={
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
};


const ManageRestaurantForm = ({onSave, isLoading }: Props) => {
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          cuisines: [],
          menuItems: [{ name: "", price: 0 }],
        },
    });

    const onSubmit = (formDataJson: RestaurantFormData) => {

    }

    return (
        <Form {...form}>           
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-8 bg-gray-50 p-10 rounded-lg"
            >
              <DetailsSection />
              <Separator />
              <CuisinesSection />
              <Separator />
              <MenuSection/>
              <Separator />
              <ImageSection/>
              {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
            </form>
        </Form>
    )

};

export default ManageRestaurantForm;
