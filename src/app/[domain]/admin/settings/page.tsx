import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateSetting } from '@/app/actions/settings';
import { Button } from '@/components/uitoolkit/Button';
import { Input } from '@/components/uitoolkit/Input';
import { Card } from '@/components/uitoolkit/Card';
import { ActionForm } from '@/components/admin/ActionForm';
import { requireStoreAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await requireStoreAdminSession();
  const whatsappSetting = await prisma.setting.findUnique({
    where: { storeId_key: { storeId: session.storeId, key: 'whatsapp_number' } },
  });
  const whatsappNumber = whatsappSetting?.value || '';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
      </div>

      <Card className="p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Integration</h3>
        <p className="text-sm text-gray-500 mb-6">
          Set the global WhatsApp number for the storefront. All &quot;Buy Now&quot; button clicks will generate orders to this number. Do not use &apos;+&apos; sign.
        </p>

        <ActionForm
          action={updateSetting}
          successMessage="WhatsApp number updated successfully!"
          resetOnSuccess={false}
          className="space-y-4 max-w-md"
        >
          <input type="hidden" name="key" value="whatsapp_number" />
          <Input
            name="value"
            label="WhatsApp Number (with country code)"
            placeholder="e.g. 919876543210"
            defaultValue={whatsappNumber}
            required
          />
          <Button type="submit">
            Save Settings
          </Button>
        </ActionForm>
      </Card>
    </div>
  );
}
