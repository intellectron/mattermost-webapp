// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

//import {FormattedMessage} from 'react-intl';

import TestHelper from 'tests/helpers/client-test-helper';

import AddBot from './add_bot.jsx';

describe('components/integrations/bots/AddBot', () => {
    const team = TestHelper.fakeTeam();

    it('blank', () => {
        const wrapper = shallow(
            <AddBot
                maxFileSize={100}
                team={team}
            />
        );
        expect(wrapper.containsMatchingElement(
            <input
                id='username'
                value={''}
            />
        )).toEqual(true);
        expect(wrapper.containsMatchingElement(
            <input
                id='displayName'
                value={''}
            />
        )).toEqual(true);
        expect(wrapper.containsMatchingElement(
            <input
                id='description'
                value={''}
            />
        )).toEqual(true);
    });

    it('edit bot', () => {
        const bot = TestHelper.fakeBot();
        const wrapper = shallow(
            <AddBot
                bot={bot}
                maxFileSize={100}
                team={team}
            />
        );
        expect(wrapper.containsMatchingElement(
            <input
                id='username'
                value={bot.username}
            />
        )).toEqual(true);
        expect(wrapper.containsMatchingElement(
            <input
                id='displayName'
                value={bot.display_name}
            />
        )).toEqual(true);
        expect(wrapper.containsMatchingElement(
            <input
                id='description'
                value={bot.description}
            />
        )).toEqual(true);
    });
});
