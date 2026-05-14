import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import type { RootStackParamList } from '../navigation/types';
import { OnboardingScreen } from './OnboardingScreen';

function renderOnboardingScreen() {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

  const route = {
    key: 'Onboarding-test',
    name: 'Onboarding',
    params: undefined,
  } as const;

  return {
    navigation,
    ...render(
      <PaperProvider>
        <OnboardingScreen navigation={navigation} route={route} />
      </PaperProvider>,
    ),
  };
}

describe('OnboardingScreen', () => {
  it('walks through the full seven-step flow', () => {
    const { navigation } = renderOnboardingScreen();

    expect(screen.getByText('What time do you usually wake up?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('When do you usually start working?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Next'));

    expect(
      screen.getByText('Do you have fixed commitments like school or work?'),
    ).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Yes'));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('What time are your fixed commitments?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText("I don't have fixed commitments"));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('When do you focus best?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Morning'));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('How much free time do you have per day?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('1-2 hours'));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('What do you want to create a schedule for?')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Study'));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.getByText('All set!')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Start planning'));

    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('skips fixed-commitment time when the user says no', () => {
    renderOnboardingScreen();

    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));

    fireEvent.press(screen.getByText('No'));
    fireEvent.press(screen.getByText('Next'));

    expect(screen.queryByText('What time are your fixed commitments?')).not.toBeOnTheScreen();
    expect(screen.getByText('When do you focus best?')).toBeOnTheScreen();
  });
});
