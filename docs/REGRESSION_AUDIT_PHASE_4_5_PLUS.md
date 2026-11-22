# AUDITORÍA DE REGRESIÓN — FASE 4.5+

**Fecha:** 2026-11-21  
**Objetivo:** Revisar y corregir errores introducidos en la implementación de AnimationController, Easing, transiciones y game-feel.

---

## 🔴 ERRORES CRÍTICOS DETECTADOS

### 1. AnimationController.animate() — `from` y `to` NO se almacenan
**Archivo:** `src/scenes/baseScene.js` líneas 60-80

```javascript
animate(options) {
  const { from = 0, to = 1, duration = 0.5, easing = Easing.easeOutCubic, onUpdate, onComplete } = options;
  // ...
  const anim = {
    id,
    startTime,
    durationMs,
    easing,
    onUpdate,
    onComplete,
    cancelled: false
    // ❌ FALTA: from, to
  };
  // ...
  const value = anim.from + (anim.to - anim.from) * eased; // ❌ NaN porque anim.from/anim.to son undefined
}
```

**Impacto:** Todas las animaciones producen `NaN` y no funcionan.

---

### 2. tween() y pop() devuelven `number` (animationId), no `Promise`
**Archivo:** `src/scenes/baseScene.js` líneas 370-400

```javascript
tween(target, property, to, duration = 0.5, easing = Easing.easeOutCubic) {
  const from = target[property];
  return this.anim.animate({ from, to, duration, easing, onUpdate: ... });
  // ❌ Devuelve number (id), NO Promise
}

pop(target, property, intensity = 0.3, duration = 0.3) {
  return this.anim.animate({ ... }); // ❌ Devuelve number
}
```

**Usos rotos (`.then()` sobre number):**
- `scene7_tickets.js:234` — `this.tween(...).then(...)`
- `scene7_tickets.js:233` — `this.pop(...)` (no se usa `.then()` pero no retorna Promise)

---

### 3. AnimationController.delay() — `this.delays` no inicializado en constructor
**Archivo:** `src/scenes/baseScene.js` líneas 128-148

```javascript
delay(ms) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      this.delays.delete(id); // ❌ this.delays es undefined si no se llamó antes
      resolve();
    }, ms);
    this.delays = this.delays || new Set(); // Lazy init funciona pero es frágil
    this.delays.add(id);
    return { cancel: () => { clearTimeout(id); this.delays.delete(id); } };
  });
}
```

**Problema adicional:** Retorna Promise Y un objeto con `cancel` — API inconsistente.

---

### 4. cancelAll() no cancela RAFs ya programados
**Archivo:** `src/scenes/baseScene.js` líneas 118-123

```javascript
cancelAll() {
  this.animations.forEach((anim, id) => {
    anim.cancelled = true;
  });
  this.animations.clear();
  // ❌ Los requestAnimationFrame ya en cola seguirán ejecutándose
  // _tick() verifica anim.cancelled al INICIO, pero si ya se llamó, se ejecuta
}
```

---

### 5. Scene 6 — transitionToPinkHearts() es async pero no usa await
**Archivo:** `src/scenes/scene6_pokeballs.js` líneas 355-389

```javascript
async transitionToPinkHearts() {
  this.phase = 'pinkHearts';
  this.background = createBackground('pinkHearts');
  // ...
  this.tween(this.pokemonCard, 'scale', 1.0, 0.8, Easing.easeOutBack);
  this.tween(this.pokemonCard, 'alpha', 1.0, 0.6, Easing.easeOutCubic);
  // ❌ No espera nada, async es innecesario
}
```

---

### 6. Scene 7 — redeemTicket() usa `.then()` sobre number
**Archivo:** `src/scenes/scene7_tickets.js` línea 234

```javascript
this.tween(ticket, 'alpha', 0.5, 0.4, Easing.easeOutCubic).then(() => {
  this.showTicketRedeemed(data);
});
// ❌ tween() devuelve number, no Promise → TypeError
```

---

### 7. Scene 8 — closeGallery() usa RAF manual en lugar de AnimationController
**Archivo:** `src/scenes/scene8_ending.js` líneas 198-222

```javascript
closeGallery() {
  let elapsed = 0;
  const animate = () => {
    elapsed += 0.016;
    // ... RAF manual
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  // ❌ No usa tween()/animate(), no se cancela en onExit()
}
```

---

### 8. pop() — segunda animación en onComplete no rastreable
**Archivo:** `src/scenes/baseScene.js` líneas 381-400

```javascript
pop(target, property, intensity = 0.3, duration = 0.3) {
  return this.anim.animate({
    // ... primera animación (subida)
    onComplete: () => {
      // Regreso suave
      this.anim.animate({ // ❌ Segunda animación no retorna Promise, no cancelable
        from: peakValue,
        to: baseValue,
        duration: duration * 0.5,
        easing: Easing.easeOutCubic,
        onUpdate: (value) => { target[property] = value; }
      });
    }
  });
}
```

---

### 9. _fade() trackea promesas en `_pendingPromises` pero array nunca se limpia
**Archivo:** `src/scenes/baseScene.js` línea 363

```javascript
this._pendingPromises.push({ cancel: () => this.anim.cancel(id) });
// ❌ Array crece indefinidamente, nunca se vacía
```

---

## 🟡 ERRORES MENORES / INCONSISTENCIAS

| # | Archivo | Línea | Problema |
|---|---------|-------|----------|
| 10 | `baseScene.js` | 363 | `_pendingPromises` array grows unbounded |
| 11 | `scene6_pokeballs.js` | 355 | `async transitionToPinkHearts()` sin `await` |
| 12 | `scene8_ending.js` | 194-222 | `closeGallery()` RAF manual sin cleanup |
| 13 | `baseScene.js` | 128-148 | `delay()` API inconsistente (Promise + objeto) |
| 14 | `baseScene.js` | 118-123 | `cancelAll()` no cancela RAFs ya en cola |
| 15 | `gameEngine.js` | - | `reducedMotionChecked` se setea una vez, no reacciona a cambios dinámicos |

---

## ✅ CORRECCIONES APLICADAS

Voy a corregir sistemáticamente todos los errores críticos.