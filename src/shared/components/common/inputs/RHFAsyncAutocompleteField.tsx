import {UIEvent, useEffect, useId, useMemo, useState} from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grow from '@mui/material/Grow';
import Paper, {PaperProps} from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {FieldValues, useController} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import {
  DROPDOWN_MIN_VISIBLE_OPTIONS,
  DROPDOWN_SCROLL_LOAD_THRESHOLD_PX,
} from '@/shared/constants/general';
import {
  RHFAsyncAutocompleteFieldProps,
  SelectOption,
} from '@/shared/interfaces/inputs';

const DropdownPaper = (props: PaperProps) => (
  <Grow in>
    <Paper elevation={8} {...props} />
  </Grow>
);

const RHFAsyncAutocompleteField = <T extends FieldValues>({
  name,
  control,
  label,
  source,
  multiple = false,
  hiddenValues,
  placeholder,
  disabled = false,
  noOptionsText,
  loadingText,
  onSelectOption,
}: RHFAsyncAutocompleteFieldProps<T>) => {
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const visibleOptions = useMemo(
    () =>
      hiddenValues?.length
        ? source.options.filter(
            (option) => !hiddenValues.includes(option.value)
          )
        : source.options,
    [source.options, hiddenValues]
  );

  // A page fully hidden by the sibling field leaves nothing to scroll.
  useEffect(() => {
    if (
      isOpen &&
      visibleOptions.length < DROPDOWN_MIN_VISIBLE_OPTIONS &&
      source.hasMore &&
      !source.isLoading &&
      !source.isLoadingMore
    )
      source.onLoadMore();
  }, [isOpen, visibleOptions.length, source]);

  const {
    field: {value, onChange},
    fieldState: {error},
  } = useController({name, control});

  const selectedValues: string[] = multiple
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  const selectedOptions = selectedValues.map(
    (selected) =>
      source.findOption({value: selected}) ?? {value: selected, label: ''}
  );

  const selectionKey = selectedOptions
    .map((option) => `${option.value}:${option.label}`)
    .join('|');

  // MUI wipes the typed search whenever `value` changes identity, so it only
  // changes when the picks or their labels do.
  const resolvedValue = useMemo(
    () => (multiple ? selectedOptions : (selectedOptions[0] ?? null)),
    [selectionKey, multiple] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleListboxScroll = (event: UIEvent<HTMLElement>) => {
    const {scrollTop, clientHeight, scrollHeight} = event.currentTarget;
    const distanceToEnd = scrollHeight - scrollTop - clientHeight;

    if (distanceToEnd <= DROPDOWN_SCROLL_LOAD_THRESHOLD_PX) source.onLoadMore();
  };

  const isBusy = source.isLoading || source.isLoadingMore;

  return (
    <FormControl fullWidth>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <Autocomplete<SelectOption, boolean>
        id={fieldId}
        multiple={multiple}
        disabled={disabled}
        disableCloseOnSelect={multiple}
        options={visibleOptions}
        value={resolvedValue as any}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, val) => option.value === val.value}

        // Server results are already filtered; filtering again would hide them.
        filterOptions={(option) => option}

        // Picking rewrites the input to the label, which must not become
        // the search; an emptied input (a multi pick, a clear) resets it.
        onInputChange={(_event, term, reason) => {
          if (reason === 'input' || term === '') source.onSearchChange({term});
        }}
        onOpen={() => setIsOpen(true)}
        onClose={() => {
          setIsOpen(false);
          source.onSearchChange({term: ''});
        }}
        onChange={(_event, newValue) => {
          const picked = (
            Array.isArray(newValue) ? newValue : newValue ? [newValue] : []
          ) as SelectOption[];

          source.rememberOptions({options: picked});
          onChange(
            multiple
              ? picked.map((option) => option.value)
              : (picked[0]?.value ?? '')
          );
          if (!multiple) onSelectOption?.({option: picked[0] ?? null});
        }}

        // MUI keys options by label; two people with the same name would collide.
        renderOption={(optionProps, option) => {
          const {key: _labelKey, ...liProps} = optionProps;

          return (
            <li key={option.value} {...liProps}>
              {option.label}
            </li>
          );
        }}
        slots={{paper: DropdownPaper}}
        slotProps={{
          listbox: {
            style: {maxHeight: 200},
            onScroll: handleListboxScroll,
          },
        }}
        loading={source.isLoading}
        loadingText={loadingText}
        noOptionsText={noOptionsText}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={Boolean(error)}

            // Spreading params.slotProps keeps htmlInput, which carries the typing bindings.
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {isBusy && <CircularProgress size={16} />}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      {error && (
        <FormHelperText sx={{color: 'error.main'}}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default RHFAsyncAutocompleteField;
