import type common from './en/common.json';
import type hub from './en/hub.json';
import type audio from './en/audio.json';
import type dev from './en/dev.json';

export type Persona = 'hub' | 'audio' | 'dev';

export type CommonDictionary = typeof common;
export type HubDictionary = CommonDictionary & typeof hub;
export type AudioDictionary = CommonDictionary & typeof audio;
export type DevDictionary = CommonDictionary & typeof dev;
