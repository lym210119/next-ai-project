import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border border-input bg-card text-card-foreground shadow-sm",
  {
    variants: {},
    defaultVariants: {},
  }
);

interface CardProps extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<
  HTMLElement,
  CardProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "div" : "div";
  return (
    <Comp
      className={cn(cardVariants, className)}
      ref={ref}
      {...props}
    >
      {props.children}
    </Comp>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    ref={ref}
    {...props}
  >
    <div className="flex items-center space-x-2 pb-2">
      <h2 className="text-lg font-semibold leading-none tracking-tight">{props.children}</h2>
    </div>
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <h3
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("p-6 pt-0", className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("flex items-center p-6 pt-0", className)}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};