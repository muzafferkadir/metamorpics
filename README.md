# Metamorpics 🎨

Fotoğraflarınızı kolayca farklı formatlara dönüştüren modern, hızlı ve kullanıcı dostu bir web uygulaması. Sürükle-bırak arayüzü ile görselleri sıkıştırın, format değiştirin ve anında indirin.

## 📑 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Ön Koşullar](#-ön-koşullar)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Konfigürasyon](#-konfigürasyon)
- [Test](#-test)
- [Deployment](#-deployment)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-i̇letişim)
- [Değişiklik Kaydı](#-değişiklik-kaydı)

## ✨ Özellikler

- **Çoklu Format Desteği**: JPEG, PNG, GIF, WebP, AVIF, BMP, TIFF formatları arası dönüşüm
- **HEIC Desteği**: Apple cihazlarından gelen HEIC/HEIF dosyalarını dönüştürme
- **Görsel Sıkıştırma**: Dosya boyutunu küçültmek için akıllı sıkıştırma
- **Kalite Kontrolü**: 0-100 arası ayarlanabilir kalite seçenekleri
- **Sürükle-Bırak**: Modern ve kullanıcı dostu arayüz
- **Anlık Önizleme**: Dönüştürme öncesi ve sonrası görsel önizleme
- **İstemci Tarafı İşleme**: Görselleriniz sunucuya yüklenmez, tam gizlilik
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## 🛠 Teknoloji Stack

- **Framework**: [Next.js 14.1.0](https://nextjs.org/) - React tabanlı full-stack framework
- **UI**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Görsel İşleme**: 
  - [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) - İstemci tarafı görsel sıkıştırma
  - [heic-to](https://www.npmjs.com/package/heic-to) - HEIC format dönüşümü
- **Dosya Yönetimi**: 
  - [react-dropzone](https://react-dropzone.js.org/) - Sürükle-bırak dosya yükleme
  - [file-saver](https://www.npmjs.com/package/file-saver) - Dosya indirme
- **Component Library**: [Radix UI](https://www.radix-ui.com/) - Erişilebilir UI bileşenleri

## 📋 Ön Koşullar

Projeyi çalıştırabilmek için sisteminizde aşağıdaki araçların kurulu olması gerekmektedir:

- **Node.js**: v18.17.0 veya üzeri ([İndir](https://nodejs.org/))
- **npm**: v9.0.0 veya üzeri (Node.js ile birlikte gelir)
- **Git**: v2.0.0 veya üzeri ([İndir](https://git-scm.com/))

### Versiyon Kontrolü

Kurulu versiyonlarınızı kontrol etmek için:

```bash
node --version
npm --version
git --version
```

## 🚀 Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/kullanici-adiniz/metamorpics.git
cd metamorpics
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut `package.json` dosyasındaki tüm bağımlılıkları yükleyecektir.

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

### 4. Uygulamayı Açın

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 💻 Kullanım

### Temel Kullanım

1. **Görsel Yükleme**: 
   - Bir görseli sürükleyip yükleme alanına bırakın
   - Veya yükleme alanına tıklayarak dosya seçici ile görsel seçin

2. **Format Seçimi**:
   - Açılır menüden hedef formatı seçin (JPEG, PNG, WebP, vb.)
   - HEIC dosyaları için sadece JPEG ve PNG seçenekleri görünür

3. **Kalite Ayarı**:
   - Kaydırıcı ile görsel kalitesini %0-100 arasında ayarlayın
   - Daha düşük kalite = Daha küçük dosya boyutu

4. **Dönüştürme**:
   - "Dönüştür" butonuna tıklayın
   - Önizleme otomatik olarak güncellenecektir

5. **İndirme**:
   - "İndir" butonuna tıklayarak dönüştürülmüş görseli kaydedin

### Örnek Kullanım Senaryoları

#### Senaryo 1: HEIC'den JPEG'e Dönüştürme
```
iPhone'dan gelen HEIC dosyası → Yükle → JPEG seç → Kalite %85 → Dönüştür → İndir
```

#### Senaryo 2: Görsel Sıkıştırma
```
Büyük PNG dosyası → Yükle → WebP seç → Kalite %70 → Dönüştür → İndir
Result: Daha küçük dosya boyutu, web için optimize
```

#### Senaryo 3: Format Değiştirme
```
BMP dosyası → Yükle → PNG seç → Kalite %100 → Dönüştür → İndir
Result: Daha modern ve yaygın format
```

## ⚙️ Konfigürasyon

### Next.js Yapılandırması

`next.config.js` dosyasında görsel işleme ayarları:

```javascript
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // İstemci tarafı işleme için
  },
};
```

### TypeScript Yapılandırması

`tsconfig.json` dosyasında path alias tanımlanmıştır:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind CSS Yapılandırması

`tailwind.config.js` dosyasında özel renk ve tema ayarları yapılabilir.

### Ortam Değişkenleri

Şu anda proje ortam değişkeni gerektirmemektedir. Tüm işlemler istemci tarafında gerçekleşir.

Eğer gelecekte API entegrasyonu eklenirse, `.env.local` dosyası oluşturun:

```bash
# .env.local örneği
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 🧪 Test

### Linter Çalıştırma

```bash
npm run lint
```

ESLint ile kod kalitesi kontrolü yapar ve potansiyel hataları tespit eder.

### Manuel Test

1. **Format Dönüşüm Testi**:
   - Her desteklenen formatı test edin (JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF)
   - Çıktı dosyasının doğru formatta olduğunu kontrol edin

2. **HEIC Dönüşüm Testi**:
   - iPhone/iPad'den gelen HEIC dosyasını yükleyin
   - JPEG veya PNG'ye dönüştürün
   - Görsel kalitesini kontrol edin

3. **Kalite Testi**:
   - Farklı kalite seviyelerini test edin (%10, %50, %90)
   - Dosya boyutu ve görsel kalite dengesini gözlemleyin

4. **Sürükle-Bırak Testi**:
   - Dosya sürükleme fonksiyonunun çalıştığını kontrol edin
   - Birden fazla dosya sürüklendiğinde sadece ilkinin seçildiğini doğrulayın

### Test Ortamı

```bash
# Development ortamında test
npm run dev

# Production build test
npm run build
npm start
```

## 📦 Deployment

### Production Build

```bash
npm run build
```

Bu komut `.next` klasöründe optimize edilmiş production build'i oluşturur.

### Vercel'e Deploy (Önerilen)

1. [Vercel hesabı](https://vercel.com/) oluşturun
2. GitHub repository'nizi bağlayın
3. Otomatik deploy için Vercel'i yapılandırın

```bash
npm i -g vercel
vercel
```

### Diğer Platformlar

#### Docker ile Deployment

```dockerfile
# Dockerfile örneği
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t metamorpics .
docker run -p 3000:3000 metamorpics
```

#### Static Export (İsteğe Bağlı)

`next.config.js` dosyasına ekleyin:

```javascript
output: 'export'
```

Sonra:

```bash
npm run build
# out/ klasörü statik dosyaları içerir
```

### CI/CD Pipeline

GitHub Actions örnek workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Projeye katkıda bulunmak için aşağıdaki adımları izleyin:

### Katkı Süreci

1. **Fork ve Clone**
   ```bash
   # Projeyi fork edin (GitHub'da)
   git clone https://github.com/kullanici-adiniz/metamorpics.git
   cd metamorpics
   ```

2. **Branch Oluşturun**
   ```bash
   git checkout -b feature/yeni-ozellik
   # veya
   git checkout -b fix/hata-duzeltmesi
   ```

3. **Değişikliklerinizi Yapın**
   - Kod yazarken TypeScript ve ESLint kurallarına uyun
   - Anlamlı commit mesajları yazın

4. **Test Edin**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit ve Push**
   ```bash
   git add .
   git commit -m "feat: yeni özellik eklendi"
   git push origin feature/yeni-ozellik
   ```

6. **Pull Request Oluşturun**
   - GitHub'da Pull Request açın
   - Değişikliklerinizi detaylı açıklayın
   - Review bekleyin

### Kod Stil Rehberi

- **TypeScript**: Strict mode kullanın
- **React**: Functional components ve hooks tercih edin
- **Formatting**: 
  - 2 space indentation
  - Tek tırnak kullanın (')
  - Satır sonu noktalı virgül kullanın
- **Naming Conventions**:
  - Components: PascalCase (`ImageConverter.tsx`)
  - Functions: camelCase (`handleConvert`)
  - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
  - Types/Interfaces: PascalCase (`ImageCompressionOptions`)

### Commit Mesaj Formatı

```
<tip>: <kısa açıklama>

[isteğe bağlı detaylı açıklama]

[isteğe bağlı footer]
```

**Tipler**:
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Formatting, noktalı virgül vs.
- `refactor`: Kod yeniden yapılandırma
- `test`: Test ekleme/düzeltme
- `chore`: Build süreci, bağımlılık güncellemeleri

**Örnekler**:
```
feat: AVIF format desteği eklendi
fix: HEIC dönüşümünde kalite kaybı düzeltildi
docs: README'ye kurulum adımları eklendi
```

## 📄 Lisans

Bu proje şu anda **TBD** (To Be Determined - Belirlenecek) lisansı altındadır. Lisans bilgisi gelecekte güncellenecektir.

### Önerilen Lisans Seçenekleri

- **MIT**: Açık kaynak, ticari kullanım serbest
- **Apache 2.0**: Patent koruması ile açık kaynak
- **GPL-3.0**: Copyleft, türev çalışmalar da açık kaynak olmalı

## 📧 İletişim

Sorularınız, önerileriniz veya hata bildirimleri için:

- **GitHub Issues**: [Issues sayfasını](https://github.com/kullanici-adiniz/metamorpics/issues) kullanın
- **Email**: TBD
- **Twitter**: TBD
- **Discord**: TBD

### Destek

Projeyi beğendiyseniz ⭐ vermeyi unutmayın!

## 📝 Değişiklik Kaydı

### [0.1.0] - 2025-11-11

#### Eklenenler
- İlk sürüm yayınlandı
- Temel görsel dönüştürme özellikleri
- HEIC format desteği
- Sürükle-bırak arayüzü
- Çoklu format desteği (JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF)
- Kalite kontrolü özelliği
- Anlık önizleme sistemi
- Modern ve responsive UI tasarımı

#### Planlananlar (Roadmap)
- [ ] Toplu dönüştürme (batch processing)
- [ ] Daha fazla format desteği (SVG, ICO)
- [ ] Görsel düzenleme araçları (crop, rotate, resize)
- [ ] Preset kalite seçenekleri (web, print, mobile)
- [ ] Dönüştürme geçmişi
- [ ] PWA desteği (Progressive Web App)
- [ ] Dark/Light tema geçişi
- [ ] Çoklu dil desteği (İngilizce, vb.)
- [ ] Görsel meta verisi görüntüleme (EXIF)
- [ ] Watermark ekleme özelliği

### Versiyon Notları

**Semantic Versioning** (MAJOR.MINOR.PATCH) kullanılmaktadır:
- **MAJOR**: Geriye uyumlu olmayan değişiklikler
- **MINOR**: Geriye uyumlu yeni özellikler
- **PATCH**: Geriye uyumlu hata düzeltmeleri

---

<div align="center">

**Metamorpics** ile görsellerinizi dönüştürün! 🚀

Made with ❤️ using Next.js and TypeScript

[⬆ Başa Dön](#metamorpics-)

</div>
