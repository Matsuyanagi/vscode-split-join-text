'use strict'

import * as vscode from 'vscode'
import { commands_map } from './split-join-text'

export function activate(context: vscode.ExtensionContext) {
    for ( const [ name, command ] of commands_map ) {
        context.subscriptions.push( vscode.commands.registerCommand( name, ( option: any ) => { command( option ) } ) )
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}