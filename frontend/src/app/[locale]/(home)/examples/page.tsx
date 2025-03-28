import { AccordionDemo } from '@/components/demo/accordion-demo';
import { AlertDemo } from '@/components/demo/alert-demo';
import { AlertDialogDemo } from '@/components/demo/alert-dialog-demo';
import { AspectRatioDemo } from '@/components/demo/aspect-ratio-demo';
import { AvatarDemo } from '@/components/demo/avatar-demo';
import { BadgeDemo } from '@/components/demo/badge-demo';
import { BreadcrumbDemo } from '@/components/demo/breadcrumb-demo';
import { ButtonDemo } from '@/components/demo/button-demo';
import { CalendarDemo } from '@/components/demo/calendar-demo';
import { CardDemo } from '@/components/demo/card-demo';
import { CarouselDemo } from '@/components/demo/carousel-demo';
import { ChartDemo } from '@/components/demo/chart-demo';
import { CheckboxDemo } from '@/components/demo/checkbox-demo';
import { CollapsibleDemo } from '@/components/demo/collapsible-demo';
import { ComboboxDemo } from '@/components/demo/combobox-demo';
import { CommandDemo } from '@/components/demo/command-demo';
import { ComponentWrapper } from '@/components/demo/component-wrapper';
import { ContextMenuDemo } from '@/components/demo/context-menu-demo';
import { DatePickerDemo } from '@/components/demo/date-picker-demo';
import { DialogDemo } from '@/components/demo/dialog-demo';
import { DrawerDemo } from '@/components/demo/drawer-demo';
import { DropdownMenuDemo } from '@/components/demo/dropdown-menu-demo';
import { FormDemo } from '@/components/demo/form-demo';
import { HoverCardDemo } from '@/components/demo/hover-card-demo';
import { InputDemo } from '@/components/demo/input-demo';
import { InputOTPDemo } from '@/components/demo/input-otp-demo';
import { LabelDemo } from '@/components/demo/label-demo';
import { MenubarDemo } from '@/components/demo/menubar-demo';
import { NavigationMenuDemo } from '@/components/demo/navigation-menu-demo';
import { PaginationDemo } from '@/components/demo/pagination-demo';
import { PopoverDemo } from '@/components/demo/popover-demo';
import { ProgressDemo } from '@/components/demo/progress-demo';
import { RadioGroupDemo } from '@/components/demo/radio-group-demo';
import { ResizableDemo } from '@/components/demo/resizable-demo';
import { ScrollAreaDemo } from '@/components/demo/scroll-area-demo';
import { SelectDemo } from '@/components/demo/select-demo';
import { SeparatorDemo } from '@/components/demo/separator-demo';
import { SheetDemo } from '@/components/demo/sheet-demo';
import { SkeletonDemo } from '@/components/demo/skeleton-demo';
import { SliderDemo } from '@/components/demo/slider-demo';
import { SonnerDemo } from '@/components/demo/sonner-demo';
import { SwitchDemo } from '@/components/demo/switch-demo';
import { TableDemo } from '@/components/demo/table-demo';
import { TabsDemo } from '@/components/demo/tabs-demo';
import { TextareaDemo } from '@/components/demo/textarea-demo';
import { ToggleDemo } from '@/components/demo/toggle-demo';
import { ToggleGroupDemo } from '@/components/demo/toggle-group-demo';
import { TooltipDemo } from '@/components/demo/tooltip-demo';

export default function SinkPage() {
    return (
        <div className='mx-auto mt-4 grid max-w-7xl flex-1 gap-4'>
            <h2>These examples are taken from shadcn official repo on Github (https://github.com/shadcn-ui/ui)</h2>
            <ComponentWrapper name='chart' className='mt-4 w-full'>
                <ChartDemo />
            </ComponentWrapper>
            <ComponentWrapper name='accordion'>
                <AccordionDemo />
            </ComponentWrapper>
            <ComponentWrapper name='alert'>
                <AlertDemo />
            </ComponentWrapper>
            <ComponentWrapper name='alert-dialog'>
                <AlertDialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name='aspect-ratio'>
                <AspectRatioDemo />
            </ComponentWrapper>
            <ComponentWrapper name='avatar'>
                <AvatarDemo />
            </ComponentWrapper>
            <ComponentWrapper name='badge'>
                <BadgeDemo />
            </ComponentWrapper>
            <ComponentWrapper name='breadcrumb'>
                <BreadcrumbDemo />
            </ComponentWrapper>
            <ComponentWrapper name='button'>
                <ButtonDemo />
            </ComponentWrapper>
            <ComponentWrapper name='calendar'>
                <CalendarDemo />
            </ComponentWrapper>
            <ComponentWrapper name='card'>
                <CardDemo />
            </ComponentWrapper>
            <ComponentWrapper name='carousel' className='hidden md:flex'>
                <CarouselDemo />
            </ComponentWrapper>
            <ComponentWrapper name='checkbox'>
                <CheckboxDemo />
            </ComponentWrapper>
            <ComponentWrapper name='collapsible'>
                <CollapsibleDemo />
            </ComponentWrapper>
            <ComponentWrapper name='combobox'>
                <ComboboxDemo />
            </ComponentWrapper>
            <ComponentWrapper name='command'>
                <CommandDemo />
            </ComponentWrapper>
            <ComponentWrapper name='context-menu'>
                <ContextMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name='date-picker'>
                <DatePickerDemo />
            </ComponentWrapper>
            <ComponentWrapper name='dialog'>
                <DialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name='drawer'>
                <DrawerDemo />
            </ComponentWrapper>
            <ComponentWrapper name='dropdown-menu'>
                <DropdownMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name='form'>
                <FormDemo />
            </ComponentWrapper>
            <ComponentWrapper name='hover-card'>
                <HoverCardDemo />
            </ComponentWrapper>
            <ComponentWrapper name='input'>
                <InputDemo />
            </ComponentWrapper>
            <ComponentWrapper name='input-otp'>
                <InputOTPDemo />
            </ComponentWrapper>
            <ComponentWrapper name='label'>
                <LabelDemo />
            </ComponentWrapper>
            <ComponentWrapper name='menubar'>
                <MenubarDemo />
            </ComponentWrapper>
            <ComponentWrapper name='navigation-menu'>
                <NavigationMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name='pagination'>
                <PaginationDemo />
            </ComponentWrapper>
            <ComponentWrapper name='popover'>
                <PopoverDemo />
            </ComponentWrapper>
            <ComponentWrapper name='progress'>
                <ProgressDemo />
            </ComponentWrapper>
            <ComponentWrapper name='radio-group'>
                <RadioGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name='resizable'>
                <ResizableDemo />
            </ComponentWrapper>
            <ComponentWrapper name='scroll-area'>
                <ScrollAreaDemo />
            </ComponentWrapper>
            <ComponentWrapper name='select'>
                <SelectDemo />
            </ComponentWrapper>
            <ComponentWrapper name='separator'>
                <SeparatorDemo />
            </ComponentWrapper>
            <ComponentWrapper name='sheet'>
                <SheetDemo />
            </ComponentWrapper>
            <ComponentWrapper name='skeleton'>
                <SkeletonDemo />
            </ComponentWrapper>
            <ComponentWrapper name='slider'>
                <SliderDemo />
            </ComponentWrapper>
            <ComponentWrapper name='sonner'>
                <SonnerDemo />
            </ComponentWrapper>
            <ComponentWrapper name='switch'>
                <SwitchDemo />
            </ComponentWrapper>
            <ComponentWrapper name='table'>
                <TableDemo />
            </ComponentWrapper>
            <ComponentWrapper name='tabs'>
                <TabsDemo />
            </ComponentWrapper>
            <ComponentWrapper name='textarea'>
                <TextareaDemo />
            </ComponentWrapper>
            <ComponentWrapper name='toggle'>
                <ToggleDemo />
            </ComponentWrapper>
            <ComponentWrapper name='toggle-group'>
                <ToggleGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name='tooltip'>
                <TooltipDemo />
            </ComponentWrapper>
        </div>
    );
}
