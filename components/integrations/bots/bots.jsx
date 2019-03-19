// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import * as Utils from 'utils/utils.jsx';
import BackstageList from 'components/backstage/components/backstage_list.jsx';

import Bot from './bot.jsx';

export default class Bots extends React.PureComponent {
    static propTypes = {

        /**
        *  Map from botUserId to bot.
        */
        bots: PropTypes.object.isRequired,

        /**
        *  Map from botUserId to accessTokens.
        */
        accessTokens: PropTypes.object.isRequired,

        /**
        *  Map from botUserId to owner.
        */
        owners: PropTypes.object.isRequired,

        actions: PropTypes.shape({

            /**
            * Ensure we have bot accounts
            */
            loadBots: PropTypes.func.isRequired,

            /**
            * Load access tokens for bot accounts
            */
            getUserAccessTokensForUser: PropTypes.func.isRequired,

            /**
            * Access token managment
            */
            createUserAccessToken: PropTypes.func.isRequired,
            revokeUserAccessToken: PropTypes.func.isRequired,
            enableUserAccessToken: PropTypes.func.isRequired,
            disableUserAccessToken: PropTypes.func.isRequired,

            /**
            * Load owner of bot account
            */
            getUser: PropTypes.func.isRequired,

            /**
            * Disable a bot
            */
            disableBot: PropTypes.func.isRequired,

            /**
            * Enable a bot
            */
            enableBot: PropTypes.func.isRequired,
        }),

        /**
        *  Only used for routing since backstage is team based.
        */
        team: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        this.props.actions.loadBots().then(
            (result) => {
                Promise.all(result.data.map((bot) => this.props.actions.getUserAccessTokensForUser(bot.user_id)).concat(result.data.map((bot) => this.props.actions.getUser(bot.user_id)))).then(() => {
                    this.setState({loading: false});
                });
            }
        );
    }

    render() {
        const bots = Object.values(this.props.bots);
        const botToJSX = (bot) => {
            return (
                <Bot
                    key={bot.user_id}
                    bot={bot}
                    owner={this.props.owners[bot.user_id]}
                    accessTokens={this.props.accessTokens[bot.user_id] || {}}
                    actions={this.props.actions}
                    team={this.props.team}
                />
            );
        };
        const enabledBots = bots.filter((bot) => bot.delete_at === 0).map(botToJSX);
        const disabledBots = bots.filter((bot) => bot.delete_at > 0).map(botToJSX);

        function DisabledSection(props) {
            if (!props.hasDisabled) {
                return null;
            }
            const botsToDisplay = React.Children.map(props.disabledBots, (child) => {
                return React.cloneElement(child, {filter: props.filter});
            });
            return (
                <React.Fragment>
                    <div className='bot-disabled'>
                        <FormattedMessage
                            id='bots.disabled'
                            defaultMessage='Disabled'
                        />
                    </div>
                    <div className='bot-list__disabled'>
                        {botsToDisplay}
                    </div>
                </React.Fragment>
            );
        }

        function EnabledSection(props) {
            const botsToDisplay = React.Children.map(props.enabledBots, (child) => {
                return React.cloneElement(child, {filter: props.filter});
            });
            return (
                <div>
                    {botsToDisplay}
                </div>
            );
        }

        return (
            <BackstageList
                header={
                    <FormattedMessage
                        id='bots.manage.header'
                        defaultMessage='Bot Accounts'
                    />
                }
                addText={
                    <FormattedMessage
                        id='bots.manage.add'
                        defaultMessage='Add Bot Account'
                    />
                }
                addLink={'/' + this.props.team.name + '/integrations/bots/add'}
                emptyText={
                    <FormattedMessage
                        id='bots.manage.empty'
                        defaultMessage='No Bot Accounts found'
                    />
                }
                helpText={
                    <FormattedMessage
                        id='bots.manage.help'
                        defaultMessage='Create {botAccounts} to conversationally interact with your app through the API.'
                        values={{
                            botAccounts: (
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href='http://docs.mattermost.com/developer/bot-accounts.html'
                                >
                                    <FormattedMessage
                                        id='bots.manage.bot_accounts'
                                        defaultMessage='Bot Accounts'
                                    />
                                </a>
                            ),
                        }}
                    />
                }
                searchPlaceholder={Utils.localizeMessage('bots.manage.search', 'Search Bot Accounts')}
                loading={this.state.loading}
            >
                <EnabledSection
                    enabledBots={enabledBots}
                />
                <DisabledSection
                    hasDisabled={disabledBots.length > 0}
                    disabledBots={disabledBots}
                />
            </BackstageList>
        );
    }
}
