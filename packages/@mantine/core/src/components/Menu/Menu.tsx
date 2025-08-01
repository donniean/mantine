import { useState } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import {
  ExtendComponent,
  Factory,
  getContextItemIndex,
  getWithProps,
  StylesApiProps,
  useProps,
  useResolvedStylesApi,
  useStyles,
} from '../../core';
import { useDelayedHover } from '../../utils/Floating';
import { __PopoverProps, Popover, PopoverStylesNames } from '../Popover';
import { MenuContextProvider } from './Menu.context';
import { MenuDivider } from './MenuDivider/MenuDivider';
import { MenuDropdown } from './MenuDropdown/MenuDropdown';
import { MenuItem } from './MenuItem/MenuItem';
import { MenuLabel } from './MenuLabel/MenuLabel';
import { MenuSub } from './MenuSub/MenuSub';
import { MenuTarget } from './MenuTarget/MenuTarget';
import classes from './Menu.module.css';

export type MenuStylesNames =
  | 'item'
  | 'itemLabel'
  | 'itemSection'
  | 'label'
  | 'divider'
  | 'chevron'
  | PopoverStylesNames;

export type MenuFactory = Factory<{
  props: MenuProps;
  stylesNames: MenuStylesNames;
}>;

export interface MenuProps extends __PopoverProps, StylesApiProps<MenuFactory> {
  variant?: string;

  /** Menu children */
  children?: React.ReactNode;

  /** Controlled menu opened state */
  opened?: boolean;

  /** Uncontrolled menu initial opened state */
  defaultOpened?: boolean;

  /** If set, focus is trapped within the menu dropdown when it is opened */
  trapFocus?: boolean;

  /** Called when menu opened state changes */
  onChange?: (opened: boolean) => void;

  /** Called when Menu is opened */
  onOpen?: () => void;

  /** Called when Menu is closed */
  onClose?: () => void;

  /** If set, the Menu is closed when one of the items is clicked */
  closeOnItemClick?: boolean;

  /** If set, arrow key presses loop though items (first to last and last to first) */
  loop?: boolean;

  /** If set, the dropdown is closed when the `Escape` key is pressed @default `true` */
  closeOnEscape?: boolean;

  /** Event trigger to open menu */
  trigger?: 'click' | 'hover' | 'click-hover';

  /** Open delay in ms, applicable only to `trigger="hover"` variant */
  openDelay?: number;

  /** Close delay in ms, applicable only to `trigger="hover"` variant */
  closeDelay?: number;

  /** If set, the dropdown is closed on outside clicks */
  closeOnClickOutside?: boolean;

  /** Events that trigger outside clicks @default `['mousedown', 'touchstart', 'keydown']` */
  clickOutsideEvents?: string[];

  /** Id base to create accessibility connections */
  id?: string;

  /** Set the `tabindex` on all menu items @default `-1` */
  menuItemTabIndex?: -1 | 0;

  /** If set, focus placeholder element is added before items @default `true` */
  withInitialFocusPlaceholder?: boolean;
}

const defaultProps = {
  trapFocus: true,
  closeOnItemClick: true,
  withInitialFocusPlaceholder: true,
  clickOutsideEvents: ['mousedown', 'touchstart', 'keydown'],
  loop: true,
  trigger: 'click',
  openDelay: 0,
  closeDelay: 100,
  menuItemTabIndex: -1,
} satisfies Partial<MenuProps>;

export function Menu(_props: MenuProps) {
  const props = useProps('Menu', defaultProps, _props);
  const {
    children,
    onOpen,
    onClose,
    opened,
    defaultOpened,
    trapFocus,
    onChange,
    closeOnItemClick,
    loop,
    closeOnEscape,
    trigger,
    openDelay,
    closeDelay,
    classNames,
    styles,
    unstyled,
    variant,
    vars,
    menuItemTabIndex,
    keepMounted,
    withInitialFocusPlaceholder,
    attributes,
    ...others
  } = props;

  const getStyles = useStyles<MenuFactory>({
    name: 'Menu',
    classes,
    props,
    classNames,
    styles,
    unstyled,
    attributes,
  });

  const [_opened, setOpened] = useUncontrolled({
    value: opened,
    defaultValue: defaultOpened,
    finalValue: false,
    onChange,
  });
  const [openedViaClick, setOpenedViaClick] = useState(false);

  const close = () => {
    setOpened(false);
    setOpenedViaClick(false);
    _opened && onClose?.();
  };

  const open = () => {
    setOpened(true);
    !_opened && onOpen?.();
  };

  const toggleDropdown = () => {
    _opened ? close() : open();
  };

  const { openDropdown, closeDropdown } = useDelayedHover({ open, close, closeDelay, openDelay });

  const getItemIndex = (node: HTMLButtonElement) =>
    getContextItemIndex('[data-menu-item]', '[data-menu-dropdown]', node);

  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi<MenuFactory>({
    classNames,
    styles,
    props,
  });

  return (
    <MenuContextProvider
      value={{
        getStyles,
        opened: _opened,
        toggleDropdown,
        getItemIndex,
        openedViaClick,
        setOpenedViaClick,
        closeOnItemClick,
        closeDropdown: trigger === 'click' ? close : closeDropdown,
        openDropdown: trigger === 'click' ? open : openDropdown,
        closeDropdownImmediately: close,
        loop,
        trigger,
        unstyled,
        menuItemTabIndex,
        withInitialFocusPlaceholder,
      }}
    >
      <Popover
        {...others}
        opened={_opened}
        onChange={toggleDropdown}
        defaultOpened={defaultOpened}
        trapFocus={keepMounted ? false : trapFocus}
        closeOnEscape={closeOnEscape}
        __staticSelector="Menu"
        classNames={resolvedClassNames}
        styles={resolvedStyles}
        unstyled={unstyled}
        variant={variant}
        keepMounted={keepMounted}
      >
        {children}
      </Popover>
    </MenuContextProvider>
  );
}

Menu.extend = (input: ExtendComponent<MenuFactory>) => input;
Menu.withProps = getWithProps<MenuProps, MenuProps>(Menu as any);
Menu.classes = classes as Record<string, string>;
Menu.displayName = '@mantine/core/Menu';
Menu.Item = MenuItem;
Menu.Label = MenuLabel;
Menu.Dropdown = MenuDropdown;
Menu.Target = MenuTarget;
Menu.Divider = MenuDivider;
Menu.Sub = MenuSub;
