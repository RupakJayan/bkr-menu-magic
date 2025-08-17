import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Globe, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Mail,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react';

interface SettingsManagementProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface SystemSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    fontSize: string;
  };
  integrations: {
    paymentGateway: string;
    emailService: string;
    smsService: string;
  };
}

const SettingsManagement: React.FC<SettingsManagementProps> = ({ language, isDark }) => {
  const [settings, setSettings] = useState<SystemSettings>({
    businessName: 'Chapa Catering Services',
    businessEmail: 'info@chapacatering.com',
    businessPhone: '+91 98765 43210',
    businessAddress: '123 Main Street, Chennai, Tamil Nadu 600001',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'strong'
    },
    appearance: {
      theme: 'auto',
      primaryColor: '#1f2937',
      fontSize: 'medium'
    },
    integrations: {
      paymentGateway: 'razorpay',
      emailService: 'sendgrid',
      smsService: 'twilio'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleDirectSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // TODO: Implement actual save functionality
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // TODO: Implement reset to default settings
    console.log('Settings reset to default');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-display font-bold ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'System Settings' : 'சிஸ்டம் அமைப்புகள்'}
          </h2>
          <p className={`text-lg ${
            isDark ? 'text-white/60' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Manage your business settings and preferences'
              : 'உங்கள் வணிக அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Reset' : 'மீட்டமை'}
          </Button>
          <Button 
            className="btn-chapa-primary" 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading 
              ? (language === 'en' ? 'Saving...' : 'சேமிக்கிறது...')
              : (language === 'en' ? 'Save Changes' : 'மாற்றங்களை சேமிக்கவும்')
            }
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            {language === 'en' ? 'General' : 'பொதுவான'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Notifications' : 'அறிவிப்புகள்'}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Security' : 'பாதுகாப்பு'}
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Appearance' : 'தோற்றம்'}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Integrations' : 'ஒருங்கிணைப்புகள்'}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardHeader>
              <CardTitle className={`text-xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Business Information' : 'வணிக தகவல்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Business Name' : 'வணிக பெயர்'}
                  </Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => handleDirectSettingChange('businessName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="businessEmail" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Business Email' : 'வணிக மின்னஞ்சல்'}
                  </Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleDirectSettingChange('businessEmail', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Business Phone' : 'வணிக தொலைபேசி'}
                  </Label>
                  <Input
                    id="businessPhone"
                    value={settings.businessPhone}
                    onChange={(e) => handleDirectSettingChange('businessPhone', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Currency' : 'நாணயம்'}
                  </Label>
                  <Select value={settings.currency} onValueChange={(value) => handleDirectSettingChange('currency', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="businessAddress" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Business Address' : 'வணிக முகவரி'}
                </Label>
                <Input
                  id="businessAddress"
                  value={settings.businessAddress}
                  onChange={(e) => handleDirectSettingChange('businessAddress', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Timezone' : 'நேர மண்டலம்'}
                  </Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleDirectSettingChange('timezone', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Language' : 'மொழி'}
                  </Label>
                  <Select value={settings.language} onValueChange={(value) => handleDirectSettingChange('language', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardHeader>
              <CardTitle className={`text-xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Notification Preferences' : 'அறிவிப்பு விருப்பங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Email Notifications' : 'மின்னஞ்சல் அறிவிப்புகள்'}
                  </Label>
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' 
                      ? 'Receive notifications via email'
                      : 'மின்னஞ்சல் மூலம் அறிவிப்புகளைப் பெறவும்'
                    }
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'SMS Notifications' : 'SMS அறிவிப்புகள்'}
                  </Label>
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' 
                      ? 'Receive notifications via SMS'
                      : 'SMS மூலம் அறிவிப்புகளைப் பெறவும்'
                    }
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Push Notifications' : 'புஷ் அறிவிப்புகள்'}
                  </Label>
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' 
                      ? 'Receive push notifications in browser'
                      : 'உலாவியில் புஷ் அறிவிப்புகளைப் பெறவும்'
                    }
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardHeader>
              <CardTitle className={`text-xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Security Settings' : 'பாதுகாப்பு அமைப்புகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Two-Factor Authentication' : 'இரண்டு காரணி உறுதிப்படுத்தல்'}
                  </Label>
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' 
                      ? 'Add an extra layer of security to your account'
                      : 'உங்கள் கணக்கிற்கு கூடுதல் பாதுகாப்பு அடுக்கைச் சேர்க்கவும்'
                    }
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Session Timeout (minutes)' : 'அமர்வு நேராவதி (நிமிடங்கள்)'}
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="passwordPolicy" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Password Policy' : 'கடவுச்சொல் கொள்கை'}
                  </Label>
                  <Select value={settings.security.passwordPolicy} onValueChange={(value) => handleSettingChange('security', 'passwordPolicy', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">{language === 'en' ? 'Weak' : 'பலவீனமான'}</SelectItem>
                      <SelectItem value="medium">{language === 'en' ? 'Medium' : 'நடுத்தர'}</SelectItem>
                      <SelectItem value="strong">{language === 'en' ? 'Strong' : 'வலுவான'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardHeader>
              <CardTitle className={`text-xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Appearance Settings' : 'தோற்றம் அமைப்புகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Theme' : 'தீம்'}
                  </Label>
                  <Select value={settings.appearance.theme} onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{language === 'en' ? 'Light' : 'வெளிச்சம்'}</SelectItem>
                      <SelectItem value="dark">{language === 'en' ? 'Dark' : 'இருள்'}</SelectItem>
                      <SelectItem value="auto">{language === 'en' ? 'Auto' : 'தானாக'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fontSize" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Font Size' : 'எழுத்து அளவு'}
                  </Label>
                  <Select value={settings.appearance.fontSize} onValueChange={(value) => handleSettingChange('appearance', 'fontSize', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{language === 'en' ? 'Small' : 'சிறிய'}</SelectItem>
                      <SelectItem value="medium">{language === 'en' ? 'Medium' : 'நடுத்தர'}</SelectItem>
                      <SelectItem value="large">{language === 'en' ? 'Large' : 'பெரிய'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="primaryColor" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Primary Color' : 'முதன்மை நிறம்'}
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardHeader>
              <CardTitle className={`text-xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Third-Party Integrations' : 'மூன்றாம் தர ஒருங்கிணைப்புகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentGateway" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Payment Gateway' : 'கட்டண நுழைவாயில்'}
                  </Label>
                  <Select value={settings.integrations.paymentGateway} onValueChange={(value) => handleSettingChange('integrations', 'paymentGateway', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emailService" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Email Service' : 'மின்னஞ்சல் சேவை'}
                  </Label>
                  <Select value={settings.integrations.emailService} onValueChange={(value) => handleSettingChange('integrations', 'emailService', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="aws-ses">AWS SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="smsService" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'SMS Service' : 'SMS சேவை'}
                </Label>
                <Select value={settings.integrations.smsService} onValueChange={(value) => handleSettingChange('integrations', 'smsService', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    <SelectItem value="msg91">MSG91</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
