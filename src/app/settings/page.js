/**
 * ================================================================================================
 * ⚙️ JEMER ACADEMY SETTINGS ENTRY PAGE
 * ================================================================================================
 * Location: src/app/settings/page.jsx
 * Description: Clean runtime entry node mounting the primary Settings Engine component.
 * ================================================================================================
 */

"use client";

import React from 'react';
import SettingsEngine from '@/jemer-components/settings/settings.jsx';

export default function SettingsPage() {
  return (
    <div className="w-full pb-12">
      <SettingsEngine />
    </div>
  );
}