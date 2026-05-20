import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import type { RootStackParamList } from '../navigation/types';
import { OnboardingScreen } from './OnboardingScreen';
import { getOnboardingProfile, saveOnboardingProfile } from '../services/onboardingProfile';

jest.mock('../services/onboardingProfile', () => ({
  getOnboardingProfile: jest.fn(),
  saveOnboardingProfile: jest.fn(),
}));

function renderOnboardingScreen(params?: RootStackParamList['Onboarding']) {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

  const route = {
    key: 'Onboarding-test',
    name: 'Onboarding',
    params,
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
  const getOnboardingProfileMock = jest.mocked(getOnboardingProfile);
  const saveOnboardingProfileMock = jest.mocked(saveOnboardingProfile);

  beforeEach(() => {
    getOnboardingProfileMock.mockReset();
    getOnboardingProfileMock.mockResolvedValue(null);
    saveOnboardingProfileMock.mockReset();
    saveOnboardingProfileMock.mockResolvedValue();
  });

  it('walks through the full seven-step flow and saves the onboarding profile', async () => {
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

    await waitFor(() => expect(screen.getByText('All set!')).toBeOnTheScreen());
    expect(saveOnboardingProfileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        wake: '7:00 AM',
        work: '7:00 AM',
        'commitment-presence': 'Yes',
        'commitment-time': { option: "I don't have fixed commitments" },
        focus: 'Morning',
        'free-time': '1-2 hours',
        goal: 'Study',
      }),
    );

    fireEvent.press(screen.getByText('Get Started'));

    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('shows an error and lets the user retry when saving the profile fails', async () => {
    saveOnboardingProfileMock
      .mockRejectedValueOnce(new Error('storage failed'))
      .mockResolvedValueOnce();

    renderOnboardingScreen();

    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Yes'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText("I don't have fixed commitments"));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Morning'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('1-2 hours'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Study'));
    fireEvent.press(screen.getByText('Next'));

    await waitFor(() =>
      expect(
        screen.getByText("Couldn't save your onboarding profile. Please try again."),
      ).toBeOnTheScreen(),
    );
    expect(screen.queryByText('All set!')).not.toBeOnTheScreen();

    fireEvent.press(screen.getByText('Next'));

    await waitFor(() => expect(screen.getByText('All set!')).toBeOnTheScreen());
    expect(saveOnboardingProfileMock).toHaveBeenCalledTimes(2);
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

  it('updates the meridiem selection when the user drags the time wheel', async () => {
    renderOnboardingScreen();

    fireEvent(screen.getByTestId('onboarding-meridiem-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 34,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 7:00 PM',
      ),
    );
  });

  it('uses five-minute steps when the user drags the minute wheel', async () => {
    renderOnboardingScreen();

    fireEvent(screen.getByTestId('onboarding-minute-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 34,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 7:05 AM',
      ),
    );
  });

  it('updates the time wheel even when drag end includes velocity', async () => {
    renderOnboardingScreen();

    fireEvent(screen.getByTestId('onboarding-hour-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 8 * 34,
        },
        velocity: {
          y: 1.2,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 9:00 AM',
      ),
    );
  });

  it('keeps hour and minute wheels clamped at their final values', async () => {
    renderOnboardingScreen();

    fireEvent(screen.getByTestId('onboarding-hour-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 11 * 34,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 12:00 AM',
      ),
    );

    fireEvent(screen.getByTestId('onboarding-minute-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 11 * 34,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 12:55 AM',
      ),
    );

    fireEvent(screen.getByTestId('onboarding-minute-wheel'), 'scrollEndDrag', {
      nativeEvent: {
        contentOffset: {
          y: 30 * 34,
        },
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 12:55 AM',
      ),
    );
  });
  it('loads a saved profile in edit mode and goes home after saving', async () => {
    getOnboardingProfileMock.mockResolvedValueOnce({
      wake: '8:00 AM',
      work: '7:00 AM',
      'commitment-presence': 'No',
      focus: 'Evening',
      'free-time': '2-3 hours',
      goal: 'Exercise',
    });
    const { navigation } = renderOnboardingScreen({ mode: 'edit' });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 8:00 AM',
      ),
    );

    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));
    fireEvent.press(screen.getByText('Next'));

    await waitFor(() => expect(screen.getByText('All set!')).toBeOnTheScreen());
    fireEvent.press(screen.getByText('Get Started'));

    expect(saveOnboardingProfileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        wake: '8:00 AM',
        work: '7:00 AM',
        'commitment-presence': 'No',
        focus: 'Evening',
        'free-time': '2-3 hours',
        goal: 'Exercise',
      }),
    );
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('waits for the saved profile before showing edit mode defaults', async () => {
    let resolveProfile: (profile: Awaited<ReturnType<typeof getOnboardingProfile>>) => void;
    getOnboardingProfileMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        }),
    );

    renderOnboardingScreen({ mode: 'edit' });

    expect(screen.queryByText('What time do you usually wake up?')).not.toBeOnTheScreen();
    expect(screen.queryByText('Wake-up time: 7:00 AM')).not.toBeOnTheScreen();

    resolveProfile!({
      wake: '8:00 AM',
      work: '9:00 AM',
      'commitment-presence': 'No',
      focus: 'Evening',
      'free-time': '2-3 hours',
      goal: 'Exercise',
    });

    await waitFor(() =>
      expect(screen.getByTestId('onboarding-time-helper')).toHaveTextContent(
        'Wake-up time: 8:00 AM',
      ),
    );
  });
});
