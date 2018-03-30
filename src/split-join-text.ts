'use strict'

import * as vscode from 'vscode'

const SPLIT_TEXT = 'extension.splitText'
const JOIN_TEXT = 'extension.joinText'

export const packaged_commands: { [ key: string ]: ( args: any ) => void } = {
	[ SPLIT_TEXT ]: ( option: any ) => {
		splitText( option )
	},
	[ JOIN_TEXT ]: ( option: any ) => {
		joinText( option )
	}
}

// 文字列中の正規表現記号をエスケープする
function escapeRegExp( s: string ) : string {
	return s.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' )
}


/**
 * 指定したセパレータで文字列を分割する
 * @param option コマンドオプション
 */
function splitText( option?: any ) {
	const defaultSeparator = vscode.workspace.getConfiguration( "splitJoinText" ).get<string>( "defaultSeparator" )

	const options: vscode.InputBoxOptions = {
		ignoreFocusOut: true,
		placeHolder: 'symbol',
		prompt: 'separator',
	}
	vscode.window.showInputBox( options ).then( inputSeparatorCharacter => {
		if ( !inputSeparatorCharacter ) {
			return
		}
		if ( !vscode.window.activeTextEditor ) {
			vscode.window.showInformationMessage( 'No editor is active' )
			return
		}

		//	正規表現記号をエスケープする
		const separatorCharacter = escapeRegExp( inputSeparatorCharacter )
		const replaceRegexp = new RegExp( separatorCharacter, 'g' )

		const editor: vscode.TextEditor = vscode.window.activeTextEditor

		let deleteSeparator = false
		//	カーソル行、選択行を取得する
		//	ソートして大きい行の方から置き換える
		const selections = [ ...editor.selections ].sort( ( a, b ) => -( a.start.line - b.start.line ) )

		//	選択にかかる行は先頭から最後までを置き換える

		selections.forEach( ( select ) => {
			let target_range = new vscode.Range( select.start, select.end )
			if ( select.isEmpty ) {
				// 選択範囲が無い。カーソル行
				const line = editor.document.lineAt( select.start.line )
				target_range = new vscode.Range( line.range.start, line.range.end )
			}

			let text = editor.document.getText( target_range )

			if ( deleteSeparator ) {
				text = text.replace( replaceRegexp, "\n" )
			} else {
				text = text.replace( replaceRegexp, separatorCharacter + "\n" )
			}

			//	置き換える
			editor.edit( ( ed ) => {
				ed.replace( target_range, text )
			} )
		} )
	} )
}

/**
 * 複数行を連結する。セパレータが指定されればそれを挟んで連結する
 * @param option オプション
 */
function joinText( option?: any ) {
	const options: vscode.InputBoxOptions = {
		ignoreFocusOut: true,
		placeHolder: 'symbol',
		prompt: 'separator',
	}
	vscode.window.showInputBox( options ).then( inputSeparatorStr => {
		if ( inputSeparatorStr !== "" && !inputSeparatorStr ) {
			return
		}
		if ( !vscode.window.activeTextEditor ) {
			vscode.window.showInformationMessage( 'No editor is active' )
			return
		}

		const separatorCharacter = inputSeparatorStr

		const editor: vscode.TextEditor = vscode.window.activeTextEditor

		let deleteIndent = false
		//	カーソル行、選択行を取得する
		//	ソートして大きい行の方から置き換える
		const selections = [ ...editor.selections ].sort( ( a, b ) => -( a.start.line - b.start.line ) )

		//	選択にかかる行は先頭から最後までを置き換える

		selections.forEach( ( select ) => {
			if ( select.isEmpty ) {
				// 選択範囲が無い
				return
			}
			let target_range = new vscode.Range( select.start, select.end )
			let text = editor.document.getText( target_range )

			if ( deleteIndent ) {
				text = text.replace( /\r?\n\s*(?=.)/g, separatorCharacter )
			} else {
				text = text.replace( /\r?\n(?=.)/g, separatorCharacter )
			}

			//	置き換える
			editor.edit( ( ed ) => {
				ed.replace( target_range, text )
			} )
		} )
	} )
}

