import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PaperProvider, TextInput } from 'react-native-paper';
import { SettingsView } from './SettingsView';

function renderSettingsView(
  overrideProps: Partial<React.ComponentProps<typeof SettingsView>> = {},
) {
  const props: React.ComponentProps<typeof SettingsView> = {
    apiKey: '',
    saved: false,
    hasUnsavedApiKeyChange: false,
    message: null,
    validating: false,
    showPreviewCatalog: false,
    onDismissMessage: jest.fn(),
    onChangeApiKey: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    onRemove: jest.fn(),
    ...overrideProps,
  };

  return render(
    <PaperProvider>
      <SettingsView {...props} />
    </PaperProvider>,
  );
}

describe('SettingsView', () => {
  it('shows a paste-friendly API key field by default', () => {
    renderSettingsView({ apiKey: 'sk-live' });

    expect(
      screen.getByText('Paste your key here. Hide it only if you need privacy while entering it.'),
    ).toBeOnTheScreen();
    const input = screen.UNSAFE_getByType(TextInput);
    expect(input.props.secureTextEntry).toBe(false);
    expect(screen.getByText('Hide')).toBeOnTheScreen();
  });

  it('toggles hide and show for the API key field', () => {
    renderSettingsView({ apiKey: 'sk-live' });

    fireEvent.press(screen.getByText('Hide'));
    expect(screen.UNSAFE_getByType(TextInput).props.secureTextEntry).toBe(true);
    expect(screen.getByText('Show')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Show'));
    expect(screen.UNSAFE_getByType(TextInput).props.secureTextEntry).toBe(false);
  });

  it('shows validating status copy and disables actions while validating', () => {
    renderSettingsView({ validating: true, saved: true });

    expect(screen.getByText('Checking your API key...')).toBeOnTheScreen();
    expect(
      screen.getByText('DayFlow is verifying the key with OpenAI before saving it.'),
    ).toBeOnTheScreen();

    const buttons = screen.UNSAFE_getAllByProps({ disabled: true });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows unsaved change copy when the key was edited after save', () => {
    renderSettingsView({ saved: true, hasUnsavedApiKeyChange: true });

    expect(screen.getByText('You have unsaved API key changes.')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Save this key to verify it. The previously verified key remains active until then.',
      ),
    ).toBeOnTheScreen();
  });

  it('shows enabled copy for a saved key', () => {
    renderSettingsView({ saved: true });

    expect(screen.getByText('AI generation is enabled.')).toBeOnTheScreen();
    expect(screen.getByText('Your API key was verified and is stored locally.')).toBeOnTheScreen();
  });
});
