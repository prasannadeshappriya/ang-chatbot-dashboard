/**
 * Created by prasanna_d on 8/30/2017.
 */
let app = angular.module('chat-bot-app',[
    'ngRoute','ui.router','ngStorage'
    ]).constant(
        'host_url', 'http://localhost:3000/'
);
