import type { MenuItem } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  item: MenuItem;
  addToCart: () => void;
};

const MenuItem = ({ item, addToCart }: Props) => {
  return (
    <Card className="cursor-pointer" onClick={addToCart}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="font-bold">
        {item.price} VND
      </CardContent>
    </Card>
  );
};

export default MenuItem;