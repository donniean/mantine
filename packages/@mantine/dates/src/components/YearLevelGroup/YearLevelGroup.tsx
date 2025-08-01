import dayjs from 'dayjs';
import { useRef } from 'react';
import { BoxProps, ElementProps, factory, Factory, StylesApiProps, useProps } from '@mantine/core';
import { DateStringValue } from '../../types';
import { handleControlKeyDown } from '../../utils';
import { LevelsGroup, LevelsGroupStylesNames } from '../LevelsGroup';
import { YearLevel, YearLevelSettings, YearLevelStylesNames } from '../YearLevel';

export type YearLevelGroupStylesNames = YearLevelStylesNames | LevelsGroupStylesNames;

export interface YearLevelGroupProps
  extends BoxProps,
    Omit<YearLevelSettings, 'withPrevious' | 'withNext' | '__onControlKeyDown' | '__getControlRef'>,
    Omit<StylesApiProps<YearLevelGroupFactory>, 'classNames' | 'styles'>,
    ElementProps<'div'> {
  classNames?: Partial<Record<string, string>>;
  styles?: Partial<Record<string, React.CSSProperties>>;
  __staticSelector?: string;

  /** Number of columns displayed next to each other */
  numberOfColumns?: number;

  /** Displayed year */
  year: DateStringValue;

  /** Function that returns level control `aria-label` */
  levelControlAriaLabel?: ((year: DateStringValue) => string) | string;
}

export type YearLevelGroupFactory = Factory<{
  props: YearLevelGroupProps;
  ref: HTMLDivElement;
  stylesNames: YearLevelGroupStylesNames;
}>;

const defaultProps = {
  numberOfColumns: 1,
} satisfies Partial<YearLevelGroupProps>;

export const YearLevelGroup = factory<YearLevelGroupFactory>((_props, ref) => {
  const props = useProps('YearLevelGroup', defaultProps, _props);
  const {
    // YearLevel settings
    year,
    locale,
    minDate,
    maxDate,
    monthsListFormat,
    getMonthControlProps,
    __onControlClick,
    __onControlMouseEnter,
    withCellSpacing,

    // CalendarHeader settings
    __preventFocus,
    nextIcon,
    previousIcon,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
    onLevelClick,
    nextDisabled,
    previousDisabled,
    hasNextLevel,
    headerControlsOrder,

    // Other settings
    classNames,
    styles,
    unstyled,
    __staticSelector,
    __stopPropagation,
    numberOfColumns,
    levelControlAriaLabel,
    yearLabelFormat,
    size,
    vars,
    attributes,
    ...others
  } = props;

  const controlsRef = useRef<HTMLButtonElement[][][]>([]);

  const years = Array(numberOfColumns)
    .fill(0)
    .map((_, yearIndex) => {
      const currentYear = dayjs(year).add(yearIndex, 'years').format('YYYY-MM-DD');

      return (
        <YearLevel
          key={yearIndex}
          size={size}
          monthsListFormat={monthsListFormat}
          year={currentYear}
          withNext={yearIndex === numberOfColumns - 1}
          withPrevious={yearIndex === 0}
          yearLabelFormat={yearLabelFormat}
          __stopPropagation={__stopPropagation}
          __onControlClick={__onControlClick}
          __onControlMouseEnter={__onControlMouseEnter}
          __onControlKeyDown={(event, payload) =>
            handleControlKeyDown({
              levelIndex: yearIndex,
              rowIndex: payload.rowIndex,
              cellIndex: payload.cellIndex,
              event,
              controlsRef,
            })
          }
          __getControlRef={(rowIndex, cellIndex, node) => {
            if (!Array.isArray(controlsRef.current[yearIndex])) {
              controlsRef.current[yearIndex] = [];
            }

            if (!Array.isArray(controlsRef.current[yearIndex][rowIndex])) {
              controlsRef.current[yearIndex][rowIndex] = [];
            }

            controlsRef.current[yearIndex][rowIndex][cellIndex] = node;
          }}
          levelControlAriaLabel={
            typeof levelControlAriaLabel === 'function'
              ? levelControlAriaLabel(currentYear)
              : levelControlAriaLabel
          }
          locale={locale}
          minDate={minDate}
          maxDate={maxDate}
          __preventFocus={__preventFocus}
          nextIcon={nextIcon}
          previousIcon={previousIcon}
          nextLabel={nextLabel}
          previousLabel={previousLabel}
          onNext={onNext}
          onPrevious={onPrevious}
          onLevelClick={onLevelClick}
          nextDisabled={nextDisabled}
          previousDisabled={previousDisabled}
          hasNextLevel={hasNextLevel}
          getMonthControlProps={getMonthControlProps}
          classNames={classNames}
          styles={styles}
          unstyled={unstyled}
          __staticSelector={__staticSelector || 'YearLevelGroup'}
          withCellSpacing={withCellSpacing}
          headerControlsOrder={headerControlsOrder}
          attributes={attributes}
        />
      );
    });

  return (
    <LevelsGroup
      classNames={classNames}
      styles={styles}
      __staticSelector={__staticSelector || 'YearLevelGroup'}
      ref={ref}
      size={size}
      unstyled={unstyled}
      attributes={attributes}
      {...others}
    >
      {years}
    </LevelsGroup>
  );
});

YearLevelGroup.classes = { ...YearLevel.classes, ...LevelsGroup.classes };
YearLevelGroup.displayName = '@mantine/dates/YearLevelGroup';
